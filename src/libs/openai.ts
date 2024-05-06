import { OpenAI } from "openai";

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default openai;
