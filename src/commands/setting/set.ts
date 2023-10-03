import { Command } from "../../structures/Command";
import { prisma, memcache } from "../../libs";
import { ChannelType, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { CACHE_KEY, CACHE_EXPIRES_TIME } from "../../consts";
import { MyLogger } from "../../utils";

const logger = new MyLogger("Command>setting>set");

export default new Command({
  builder: new SlashCommandBuilder()
    .addSubcommand((channel) =>
      channel
        .setName("chatgpt-channel")
        .setDescription("Set channel untuk interaksi chat gpt dengan bot")
        .addChannelOption((channel_opt) =>
          channel_opt
            .setName("channel")
            .setDescription("Nama channel")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText),
        ),
    )
    .setName("set")
    .setDescription("Perintah untuk segala macam konfigurasi terhadap bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async run({ interaction, args }) {
    switch (args.getSubcommand()) {
      case "chatgpt-channel":
        const textChannel = args.getChannel<ChannelType.GuildText>("channel");
        try {
          await prisma.guild.update({
            where: { guildId: interaction.guildId },
            data: { configData: { update: { chatGptChannelId: textChannel.id } } },
          });
          memcache.replace(
            CACHE_KEY.chatGptChannelId`${interaction.guildId}`,
            textChannel.id,
            { expires: CACHE_EXPIRES_TIME.chatGptChannelId },
            (_, success) => {
              if (!success) {
                memcache.set(CACHE_KEY.chatGptChannelId`${interaction.guildId}`, textChannel.id, {
                  expires: CACHE_EXPIRES_TIME.chatGptChannelId,
                });
              }
            },
          );
          logger.info(
            `Channel untuk interaksi dengan chat GPT telah ditambahkan pada server: ${interaction.guild.name}, channel: ${textChannel.name}`,
          );
          interaction.followUp(`Channel sudah ditambahkan <#${textChannel.id}>`);
        } catch (error) {
          if (error instanceof Error) logger.error(error.message);
          else logger.error(error);
          interaction.reply({
            content: "Terdapat error saat menambahkan channel",
            ephemeral: true,
          });
        }
        break;
      default:
        break;
    }
  },
});
