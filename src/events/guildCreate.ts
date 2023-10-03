import { Event } from "../structures/Event";
import { prisma } from "../libs";
import { MyLogger } from "../utils";

const logger = new MyLogger("Event>guildCreate");

export default new Event("guildCreate", async function (guild) {
  try {
    const findGuild = await prisma.guild.findUnique({
      where: { guildId: guild.id },
    });
    if (!findGuild) {
      await prisma.guild.create({
        data: {
          guildId: guild.id,
          guildName: guild.name,
          configData: { create: { chatGptChannelId: "0" } },
        },
      });
      logger.info(`Server baru telah ditambahkan.\nid: ${guild.id}\nname: ${guild.name}`);
    }
  } catch (error) {
    logger.error(error);
  }
});
