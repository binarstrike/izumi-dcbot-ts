import { SlashCommandBuilder } from "discord.js"
import { Command } from "../../structures/Command"

export default new Command({
  builder: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show help for other commnad"),
  async run({ interaction }) {
    interaction.followUp("Hi")
  },
})
