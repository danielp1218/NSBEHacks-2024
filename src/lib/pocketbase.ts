import PocketBase from "pocketbase";
import {
	SECRET_POCKETBASE_URL,
	SECRET_POCKETBASE_PASSWORD,
	SECRET_POCKETBASE_EMAIL
} from "$env/static/private";

export const pb = new PocketBase(SECRET_POCKETBASE_URL);
await pb.admins.authWithPassword(SECRET_POCKETBASE_EMAIL, SECRET_POCKETBASE_PASSWORD);
pb.autoCancellation(false)