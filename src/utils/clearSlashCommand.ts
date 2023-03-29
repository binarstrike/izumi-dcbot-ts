import { client } from ".."
import { Routes, Guild } from "discord.js"

export async function clearCommandGuild(guild: Guild): Promise<void> {
  try {
    await client.rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
      { body: [] }
    )
    console.log(`removing slash command\nserver: ${guild.name}`)
  } catch (error) {
    console.log(error)
  }
}
export async function clearCommandGlobal(): Promise<void> {
  try {
    await client.rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    })
    console.log(`removing slash command globally`)
  } catch (error) {
    console.log(error)
  }
}

export default {
  clearCommandGuild,
  clearCommandGlobal,
}
