import {
  CommandInteraction,
  CommandInteractionOptionResolver,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js"
import { ExtendedClient } from "../structures/Client"

/**
 * {
 *  name: "commandname",
 *  description: "any description",
 *  run: async({ interaction }) => {
 *
 *  }
 * }
 */
export interface ExtendedInteraction extends CommandInteraction {
  member: GuildMember
}

interface RunOptions {
  client: ExtendedClient
  interaction: ExtendedInteraction
  args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any

export type CommandBuilderType = {
  builder: SlashCommandBuilder
  run: RunFunction
}
