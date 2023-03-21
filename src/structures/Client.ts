import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentBits,
} from "discord.js"
import { CommandBuilderType } from "../typings/Command"
import glob from "glob"
import { promisify } from "util"
import { Event } from "./Event"
import dotenv from "dotenv"

dotenv.config()
const globPromise = promisify(glob)

export class ExtendedClient extends Client {
  commands: Collection<string, CommandBuilderType> = new Collection()
  slashCommands: ApplicationCommandDataResolvable[] = []

  constructor() {
    super({
      intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
      ],
    })
  }

  start(): void {
    this.registerModules()
    this.login(process.env.BOT_TOKEN)
  }
  async importFile(filePath: string) {
    return (await import(filePath))?.default
  }

  async registerModules() {
    // Commands
    const commandFiles = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    )
    commandFiles.forEach(async (filePath) => {
      const command: CommandBuilderType = await this.importFile(filePath)
      if (!command.builder?.name) return

      this.commands.set(command.builder.name, command)
      this.slashCommands.push(command.builder.toJSON())
    })

    // Event
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
    eventFiles.forEach(async (filePath) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath)
      this.on(event.event, event.run)
    })
  }
}
