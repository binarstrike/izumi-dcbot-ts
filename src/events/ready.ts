import { Event } from "../structures/Event"
import { client } from ".."

export default new Event("ready", async function (client_) {
  console.log("Registering slash command...")
  client.application.commands.cache.clear()
  await client.application.commands.set(client.slashCommands)
  client_.user.setPresence({
    activities: [{ name: "Genshin Impact 24/7", type: 0 }],
    status: "dnd",
  })
  console.log(`Bot is online ${client_.user.tag}`)
})
