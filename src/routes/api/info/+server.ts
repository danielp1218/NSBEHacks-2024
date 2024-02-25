import {error, json, text} from "@sveltejs/kit";
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
		return text(careerData.info);
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
				content: "Provide a description of a specified career path. Separate into these sections: responsibilities, education/training/skills required, and extra information that would be helpful to someone considering this career. Use dashes as bullet points. Reserve tildes (~) and colons (:) for section titles. Section titles must end with exactly one colon at the end of the section title. Section titles must also be completely surrounded by one tilde on each side (surround the one colon as well)."
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
			await pb.collection("info").create({ career, info: response });
			controller.close();
		}
	});

	return new Response(stream, { headers: { "Content-Type": "text/event-stream" } });
};
