import { Event } from "../structures/Event"

export default new Event("guildDelete", (guild) => {
  console.log(`Kicked from server ${guild.name}`)
})
