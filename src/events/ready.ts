import { Event } from "../structures/Event"
import { ActivityType } from "discord.js"

export default new Event("ready", (i) => {
  i.user.setPresence({
    status: "dnd",
    activities: [{ name: "Test BOT", type: ActivityType.Playing }],
  })
  console.log(`Bot is online ${i.user.tag}`)
})
