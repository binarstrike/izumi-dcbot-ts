import { OpenAIApi, Configuration } from "openai"

export const OPENAI_CONFIG: Configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})

export const openAI: OpenAIApi = new OpenAIApi(OPENAI_CONFIG)

export default openAI
