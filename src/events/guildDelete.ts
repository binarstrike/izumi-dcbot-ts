import { Event } from "../structures/Event";
import { db } from "../libs";
import { newLogger } from "../libs";

const logger = newLogger("Event>guildDelete");

export default new Event("guildDelete", async function (guild) {
  try {
    await db.guild.delete({ where: { guildId: guild.id } });
    logger.info(`Kicked from Server: ${guild.name} - ${guild.id}`);
  } catch (error) {
    logger.error(error);
  }
});
