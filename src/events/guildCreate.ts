import { Event } from "../structures/Event"
import prisma from "../configs/prisma"

export default new Event("guildCreate", async function (guild) {
  try {
    const findServer = await prisma.serverData.findUnique({
      where: { serverId: guild.id },
    })
    if (!findServer) {
      await prisma.serverData.create({
        data: {
          serverId: guild.id,
          serverName: guild.name,
          channelConfiguration: {
            create: { channelName: "general" },
          },
        },
      })
      console.log(
        `Server baru telah ditambahkan.\nid: ${guild.id}\nname: ${guild.name}`
      )
      return
    }
    console.log(
      `Server baru telah ditambahkan.\nid: ${guild.id}\nname: ${guild.name}`
    )
  } catch (error) {
    console.log(error)
  }
})
