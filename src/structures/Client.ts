import {
  type ApplicationCommandDataResolvable,
  Client,
  Guild,
  ClientEvents,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import type { CommandBuilder } from "../types";
import glob from "glob";
import { promisify } from "util";
import { Event } from "./Event";
import { newLogger } from "../libs";

const globPromise = promisify(glob);
const logger = newLogger("Client");

export class ExtendedClient extends Client {
  commands = new Collection<string, CommandBuilder>();
  slashCommands: Array<ApplicationCommandDataResolvable> = [];
  rest = new REST().setToken(process.env.BOT_TOKEN);

  constructor() {
    super({
      intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
      ],
    });
  }

  public async start(): Promise<void> {
    await this.registerModules();
    if (/(--reload|-r)/.test(process.argv[2])) {
      await this.registerSlashCommand();
    }
    this.login(process.env.BOT_TOKEN);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async importFile<T = any>(filePath: string): Promise<T> {
    return (await import(filePath)).default;
  }

  private async registerModules(): Promise<void> {
    //* Commands
    const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`);
    commandFiles.forEach(async (filePath: string) => {
      const command = await this.importFile<CommandBuilder>(filePath);
      if (!command.builder?.name) return;

      this.commands.set(command.builder.name, command);
      this.slashCommands.push(command.builder.toJSON());
      logger.info(`load slash command: ${command.builder.name}`);
    });

    //* Events
    const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
    eventFiles.forEach(async (filePath: string) => {
      const ev = await this.importFile<Event<keyof ClientEvents>>(filePath);
      ev.isOnce ? this.once(ev.event, ev.run) : this.on(ev.event, ev.run);
      logger.info(`register event: ${ev.event}`);
    });
  }

  public async registerSlashCommand(guild?: Guild): Promise<void> {
    try {
      if (guild) {
        await this.rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id), {
          body: this.slashCommands,
        });
        logger.info(`registering slash command\nserver: ${guild.name}`);
        return;
      }

      await this.rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: this.slashCommands,
      });
      logger.info("registering slash command globally");
    } catch (error) {
      logger.error(error);
    }
  }
}
