import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { ExtendedClient } from "../structures/Client";

interface RunOptions {
  client: ExtendedClient;
  interaction: ExtendedInteraction;
  args: CommandInteractionOptionResolver;
}

type RunFunction = (options: RunOptions) => void;

export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember;
}

export type CommandBuilder = {
  builder: SlashCommandBuilder;
  run: RunFunction;
};
