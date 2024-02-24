import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { pb } from "$lib/pocketbase";

export const GET: RequestHandler = async ({ url }) => {
		const career1 = url.searchParams.get("career1");
		const career2 = url.searchParams.get("career2");

		if (!career1 || !career2) {
			error(400, "Must pass career1 and career2 parameters");
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
			await pb.collection("merge_cache").create({
				career1,
				career2,
				result: career1.concat(career2)
			});

			return json({
				result: career1.concat(career2)
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
	}
;