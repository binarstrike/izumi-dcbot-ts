import { EmbedBuilder } from "discord.js";
import { ImageGenerateParams } from "openai/resources";

export function generateEmbedForImage(
  imageUrl: string,
  imageGenerateOpts: ImageGenerateParams,
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("Generated Image by AI")
    .setDescription(
      `**prompt: **\`${imageGenerateOpts.prompt}\`\n**n: **\`${imageGenerateOpts.n}\`\n**size: **\`${imageGenerateOpts.size}\``,
    )
    .setImage(imageUrl)
    .setColor(0x98ff98);
}
