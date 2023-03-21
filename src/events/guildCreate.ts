import { Event } from "../structures/Event"
import { client } from ".."

export default new Event("guildCreate", async (guild) => {
  await guild.commands.set(client.slashCommands)
  console.log(`Registering commands to ${guild.id}`)
})
