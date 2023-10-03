import { Event } from "../structures/Event";
import { prisma } from "../libs";
import { MyLogger } from "../utils";

const logger = new MyLogger("Event>guildDelete");

export default new Event("guildDelete", async function (guild) {
  try {
    await prisma.guild.delete({ where: { guildId: guild.id } });
    logger.info(`Kicked from Server: ${guild.name} - ${guild.id}`);
  } catch (error) {
    logger.error(error);
  }
});
