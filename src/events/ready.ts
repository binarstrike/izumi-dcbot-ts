import { ActivityType } from "discord.js";
import { Event } from "../structures/Event";
import { newLogger } from "../libs";

const logger = newLogger("Event>ready");

export default new Event(
  "ready",
  async function (client) {
    client.user.setPresence({
      activities: [{ name: process.env.CLIENT_ACTIVITY_NAME, type: ActivityType["Playing"] }],
      status: process.env.CLIENT_ACTIVITY_STATUS,
    });
    logger.info(`Bot is online ${client.user.tag}`);
  },
  true,
);
