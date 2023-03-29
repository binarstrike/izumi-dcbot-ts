import openAI from "../../../configs/openai"
import { CreateImageRequestSizeEnum, CreateImageRequest } from "openai"
import { CommandInteractionOptionResolver } from "discord.js"

export let createImageOpts: CreateImageRequest

export default async function (
  args: CommandInteractionOptionResolver
): Promise<string[]> {
  createImageOpts = {
    prompt: args.getString("prompt"),
    n: args.getNumber("n") ?? 1,
    size: (args.getString("size") ?? "256x256") as CreateImageRequestSizeEnum,
  }
  try {
    const generatedImage = await openAI.createImage(createImageOpts)
    const listImageUrl = generatedImage.data.data.map((data) => data.url)
    return listImageUrl
  } catch (error) {
    console.log(__filename, error.message)
  }
}
