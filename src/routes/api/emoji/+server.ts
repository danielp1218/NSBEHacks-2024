import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { openai } from "$lib/openai";
import { pb } from "$lib/pocketbase";

let lock = false;

const waitForUnlock = () => {
	if (lock) {
		setTimeout(waitForUnlock, 50);
	}
};

export const POST: RequestHandler = async ({ request }) => {
	if (lock) {
		waitForUnlock();
	}
	lock = true;

	let { career } = await request.json();

	if (!career) {
		error(400, "Must pass career parameter");
	}

	career = career.trim().toLowerCase();

	let careerData;
	try {
		careerData = await pb.collection("emojis").getFirstListItem(`career = "${career}"`);
		return json({ emoji: careerData.emoji });
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
				content:
					"Please find the emoji for a career. Respond with only ONE emoji, even if the request is incomplete."
			},
			{
				role: "user",
				content: `Find the emoji for ${career}`
			}
		]
	});

	if (!result.choices[0].message.content) {
		error(500, "Something went wrong");
	}

	await pb.collection("emojis").create({ career, emoji: result.choices[0].message.content });

	lock = false;

	return json({ emoji: result.choices[0].message.content });
};
