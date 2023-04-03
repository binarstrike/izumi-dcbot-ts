/**
 * embed builder generator for replying error message to server
 */

import { EmbedBuilder } from "discord.js"

export default class ErrorEmbedGenerator extends EmbedBuilder {
  constructor(text: string, reason: string) {
    super()
    this.setColor(0xfe0e0e).setDescription(
      `> **${text}**\n> reason: \`${reason}\``
    )
  }
}
