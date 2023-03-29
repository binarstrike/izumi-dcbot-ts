import { CommandBuilderType } from "../typings/Command"
import glob from "glob"
import { promisify } from "util"
import { Event } from "./Event"
import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentBits,
  REST,
} from "discord.js"
import { resolve } from "path"
import dotenv from "dotenv"

if (process.env?.NODE_ENV !== "production")
  dotenv.config({ path: resolve(process.cwd(), ".env.development.local") })
else dotenv.config()

const globPromise = promisify(glob)

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandBuilderType> = new Collection()
  public slashCommands: ApplicationCommandDataResolvable[] = []
  public rest: REST = new REST({ version: "10" }).setToken(
    process.env.BOT_TOKEN
  )

  constructor() {
    super({
      intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
      ],
    })
  }

  public async start(): Promise<void> {
    await this.registerModules()
    this.login(process.env.BOT_TOKEN)
  }
  private async importFile(filePath: string): Promise<any> {
    return (await import(filePath))?.default
  }

  private async registerModules(): Promise<void> {
    // Commands
    const commandFiles = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    )
    commandFiles.forEach(async (filePath: string) => {
      const command: CommandBuilderType = await this.importFile(filePath)
      if (!command.builder?.name) return

      this.commands.set(command.builder.name, command)
      this.slashCommands.push(command.builder.toJSON())
    })

    // Event
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
    eventFiles.forEach(async (filePath: string) => {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath)
      this.on(event.event, event.run)
    })
  }
}
