import { EmbedBuilder } from "discord.js";
import { ImageGenerateParams } from "openai/resources";

export function generateEmbedForImage(imageUrl: string, params: ImageGenerateParams): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("Generated Image by AI")
    .setDescription(
      `**prompt: **\`${params.prompt}\`\n**n: **\`${params.n}\`\n**size: **\`${params.size}\``,
    )
    .setImage(imageUrl)
    .setColor(0x98ff98);
}
