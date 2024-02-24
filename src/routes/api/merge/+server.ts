import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { pb } from "$lib/pocketbase";
import { openai } from "$lib/openai";

export const POST: RequestHandler = async ({ request }) => {
	let { career1, career2 } = await request.json();

	if (!career1 || !career2) {
		error(400, "Must pass career1 and career2 parameters");
	}

	career1 = career1.trim().toLowerCase();
	career2 = career2.trim().toLowerCase();

	const onlyLettersPattern = /^[A-Za-z\s]+$/;
	if (!onlyLettersPattern.test(career1) || !onlyLettersPattern.test(career2)) {
		error(400, "Only letters are allowed");
	}

	let record1, record2;
	try {
		record1 = await pb
			.collection("merge_cache")
			.getFirstListItem(`career1 = "${career1}" && career2 = "${career2}"`);
	} catch (error) {
		record1 = null;
	}

	try {
		record2 = await pb
			.collection("merge_cache")
			.getFirstListItem(`career1 = "${career2}" && career2 = "${career1}"`);
	} catch (error) {
		record2 = null;
	}

	if (!record1 && !record2) {
		const result = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"Please find the union between two careers into a more specific career that shares elements from both. Respond with 1 to 3 words."
				},
				{
					role: "user",
					content: `Find the union between ${career1} and ${career2}`
				}
			]
		});

		if (!result.choices[0].message.content) {
			error(500, "Something went wrong");
		}

		await pb.collection("merge_cache").create({
			career1: career1.trim().toLowerCase(),
			career2: career2.trim().toLowerCase(),
			result: result.choices[0].message.content.trim().toLowerCase()
		});

		return json({
			result: result.choices[0].message.content
		});
	}

	if (record1) {
		return json({
			result: record1.result
		});
	} else if (record2) {
		return json({
			result: record2.result
		});
	}

	error(500, "Something went wrong");
};
