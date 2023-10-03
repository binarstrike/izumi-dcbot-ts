import { Command } from "../../structures/Command";
import { SlashCommandBuilder } from "discord.js";

export default new Command({
  builder: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show help for other command"),
  async run({ interaction }) {
    interaction.followUp("Test");
  },
});
