import { Command } from "../../structures/Command";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default new Command({
  builder: new SlashCommandBuilder().setName("help").setDescription("List the available commands"),
  async run({ interaction }) {
    const helpMessage = new EmbedBuilder().setColor(0xffffff).setDescription(`
    ### <@${interaction.client.user.id}>'s commands

    :arrow_right: </help:1237027078122246284> | Show this help message

    :arrow_right: </ping:1237027078122246285> | Check bot latency

    :arrow_right: </image generate:1237027078122246286> | Command utility for image generation

    :arrow_right: </blush:1237027078122246287>| Send a blush reaction to the target member`);

    if (interaction.deferred) {
      await interaction.followUp({ embeds: [helpMessage] });
      return;
    }
    await interaction.channel.send({ embeds: [helpMessage] });
  },
});
