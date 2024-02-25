import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { openai } from "$lib/openai";
import { pb } from "$lib/pocketbase";

export const POST: RequestHandler = async ({ request }) => {
	let { career } = await request.json();

	if (!career) {
		error(400, "Must pass career parameter");
	}

	career = career.trim().toLowerCase();

	let careerData;
	try {
		careerData = await pb.collection("info").getFirstListItem(`career = "${career}"`);
		return json({ info: careerData.info });
	} catch (error) {
		careerData = null;
	}

	const onlyLettersPattern = /^[A-Za-z\s]+$/;
	if (!onlyLettersPattern.test(career)) {
		error(400, "Only letters are allowed");
	}

	const result = await openai.chat.completions.create({
		model: "gpt-4",
		messages: [
			{
				role: "system",
				content: "Provide a description of a specified career path. Separate into these sections, and use bullet points: responsibilities, education/training/skills required, and other information that would be helpful to someone considering this career."
			},
			{
				role: "user",
				content: `Describe ${career}`
			}
		],
		stream: true
	});

	let response = "";
	const stream = new ReadableStream({
		async start(controller) {
			for await (const chunk of result) {
				response += chunk.choices[0]?.delta?.content || "";
				controller.enqueue(chunk.choices[0]?.delta?.content || "");
				console.log(chunk.choices[0]?.delta?.content || "");
			}
			controller.close();
		}
	});
	await pb.collection("info").create({ career, info: response });

	return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
};
