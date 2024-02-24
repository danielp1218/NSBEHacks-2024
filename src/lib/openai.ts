import OpenAI from "openai";
import { SECRET_OPENAI_KEY } from "$env/static/private";

export const openai = new OpenAI({
	apiKey: SECRET_OPENAI_KEY
});
