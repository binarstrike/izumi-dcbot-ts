import { Event } from "../structures/Event";
import { db } from "../libs";
import { newLogger } from "../libs";

const logger = newLogger("Event:guildCreate");

export default new Event("guildCreate", async function (guild) {
  try {
    const findGuild = await db.guild.findUnique({
      where: { guildId: guild.id },
    });
    if (!findGuild) {
      await db.guild.create({
        data: {
          guildId: guild.id,
          guildName: guild.name,
        },
      });
      logger.info(`New server added ${guild.name} with id ${guild.id}`);
    }
  } catch (error) {
    logger.error(error);
  }
});
