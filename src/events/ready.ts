import { Event } from "../structures/Event";
import { MyLogger, registerSlashCommand } from "../utils";

const logger = new MyLogger("Events>ready");

export default new Event(
  "ready",
  async function (client) {
    await registerSlashCommand();
    client.user.setPresence({
      activities: [{ name: "experimental version", type: 0 }],
      status: "dnd",
    });
    logger.info(`Bot is online ${client.user.tag}`);
  },
  true,
);
