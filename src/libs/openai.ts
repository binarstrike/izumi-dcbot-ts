import { OpenAI, ClientOptions } from "openai";
import { envConfig } from "../env.config";

const OPENAI_CONFIG: ClientOptions = {
  apiKey: envConfig.OPENAI_KEY,
};

export const openai = new OpenAI(OPENAI_CONFIG);
