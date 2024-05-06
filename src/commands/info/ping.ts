import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
  builder: new SlashCommandBuilder().setName("ping").setDescription("Check bot latency"),
  async run({ interaction }) {
    await interaction.followUp(
      `🏓 | Latency is: **${Date.now() - interaction.createdTimestamp}ms.**`,
    );
  },
});
