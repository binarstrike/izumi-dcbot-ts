import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentBits,
  REST,
} from "discord.js";
import { CommandBuilderType } from "../types";
import glob from "glob";
import { promisify } from "util";
import { Event } from "./Event";
import envConfig from "../env.config";
import { MyLogger } from "../utils";

const globPromise = promisify(glob);
const logger = new MyLogger("Client");

export class ExtendedClient extends Client {
  commands: Collection<string, CommandBuilderType> = new Collection();
  slashCommands: ApplicationCommandDataResolvable[] = [];
  rest: REST = new REST({ version: "10" }).setToken(envConfig.BOT_TOKEN);

  constructor() {
    super({
      intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
      ],
    });
  }

  async start(): Promise<void> {
    await this.registerModules();
    this.login(envConfig.BOT_TOKEN);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async importFile<Ttype = any>(filePath: string): Promise<Ttype> {
    return (await import(filePath)).default;
  }

  private async registerModules(): Promise<void> {
    //* Commands
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commandFiles: any[] = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);
    commandFiles.forEach(async (filePath: string) => {
      const command = await this.importFile<CommandBuilderType>(filePath);
      if (!command.builder?.name) return;

      this.commands.set(command.builder.name, command);
      this.slashCommands.push(command.builder.toJSON());
      logger.info(`load slash command: ${command.builder.name}`);
    });

    //* Events
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventFiles: any[] = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
    eventFiles.forEach(async (filePath: string) => {
      const event = await this.importFile<Event<keyof ClientEvents>>(filePath);
      event.isOnce ? this.once(event.event, event.run) : this.on(event.event, event.run);
      logger.info(`register event: ${event.event}`);
    });
  }
}
