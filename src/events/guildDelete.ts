import { Event } from "../structures/Event"
import prisma from "../configs/prisma"

export default new Event("guildDelete", async function (guild) {
  try {
    await prisma.channelConfiguration.delete({ where: { idServer: guild.id } })
    await prisma.serverData.delete({ where: { serverId: guild.id } })
    console.log(`Kicked from Server: ${guild.name} - ${guild.id}`)
  } catch (error) {
    console.log(error.message)
  }
})
