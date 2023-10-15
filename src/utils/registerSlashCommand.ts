import envConfig from "../env.config";
import { client } from "../main";
import { Routes, Guild } from "discord.js";
import { MyLogger } from ".";

const logger = new MyLogger("utils>registerSlashCommand");

export async function registerSlashCommand(guild?: Guild): Promise<void> {
  try {
    if (guild) {
      await client.rest.put(Routes.applicationGuildCommands(envConfig.CLIENT_ID, guild.id), {
        body: client.slashCommands,
      });
      logger.info(`registering slash command\nserver: ${guild.name}`);
      return;
    }
    await client.rest.put(Routes.applicationCommands(envConfig.CLIENT_ID), {
      body: client.slashCommands,
    });
    logger.info("registering slash command globally");
  } catch (error) {
    logger.error(error);
  }
}
