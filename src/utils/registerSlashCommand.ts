import { client } from ".."
import { Routes, Guild } from "discord.js"

export async function registerCommandGuild(guild: Guild): Promise<void> {
  try {
    await client.rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
      { body: client.slashCommands }
    )
    console.log(`registering slash command\nserver: ${guild.name}`)
  } catch (error) {
    console.log(error)
  }
}
export async function registerCommandGlobal(): Promise<void> {
  try {
    await client.rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: client.slashCommands,
    })
    console.log(`registering slash command globally`)
  } catch (error) {
    console.log(error)
  }
}

export default {
  registerCommandGuild,
  registerCommandGlobal,
}
