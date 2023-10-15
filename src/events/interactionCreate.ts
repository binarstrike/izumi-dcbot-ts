import { CommandInteractionOptionResolver } from "discord.js";
import { client } from "../main";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../types";

export default new Event("interactionCreate", async function (interaction) {
  // Chat Input Commands
  if (interaction.isCommand()) {
    await interaction.deferReply();
    const command = client.commands.get(interaction.commandName);
    if (!command) return interaction.followUp("You have used a non existent command");

    command.run({
      args: interaction.options as CommandInteractionOptionResolver,
      client,
      interaction: interaction as ExtendedInteraction,
    });
  }
});
