import { SlashCommandBuilder } from "discord.js"
import { Command } from "../../structures/Command"

export default new Command({
  builder: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show help for other commnad"),
  run: async ({ interaction }) => {
    interaction.followUp("Hi")
  },
})
