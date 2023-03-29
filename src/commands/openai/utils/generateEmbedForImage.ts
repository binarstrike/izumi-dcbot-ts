import { createImageOpts } from "./generateImageUrl"
import { EmbedBuilder } from "discord.js"

export default function (imageUrl: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("Generated Image by AI")
    .setDescription(
      `**prompt: **\`${createImageOpts.prompt}\`\n**n: **\`${createImageOpts.n}\`\n**size: **\`${createImageOpts.size}\``
    )
    .setImage(imageUrl)
    .setColor(0x98ff98)
}
