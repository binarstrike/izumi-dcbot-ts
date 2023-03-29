import { Event } from "../structures/Event"
import { registerCommandGlobal } from "../utils/registerSlashCommand"

export default new Event("ready", async function (client_) {
  await registerCommandGlobal()
  client_.user.setPresence({
    activities: [{ name: "experimental version", type: 0 }],
    status: "dnd",
  })
  console.log(`Bot is online ${client_.user.tag}`)
})
