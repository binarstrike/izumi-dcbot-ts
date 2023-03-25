import { Command } from "../../structures/Command"
import prisma from "../../configs/prisma"
import memcacheClient from "../../configs/memcached"
import {
  ChannelType,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js"

export default new Command({
  builder: new SlashCommandBuilder()
    .addSubcommand((channel) =>
      channel
        .setName("channel")
        .setDescription("Set default channel untuk bot")
        .addChannelOption((channel_opt) =>
          channel_opt
            .setName("channel")
            .setDescription("Nama channel")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .setName("set")
    .setDescription("Perintah untuk segala macam konfigurasi terhadap bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async run({ interaction, args }) {
    switch (args.getSubcommand()) {
      case "channel":
        const channel_opt = args.getChannel("channel")
        try {
          await prisma.channelConfiguration.update({
            where: { idServer: interaction.guildId },
            data: {
              channelId: channel_opt.id,
              channelName: channel_opt.name,
            },
          })
          await memcacheClient.set(channel_opt.id, channel_opt.name, {
            lifetime: 90,
          })
          console.log(
            `Channel telah ditambahkan pada Server\nserver: ${interaction.guild.name}\nchannel: ${channel_opt.name}`
          )
          interaction.followUp(`Channel sudah ditambahkan <#${channel_opt.id}>`)
        } catch (error) {
          console.log(error.message)
          interaction.reply({
            content: "Terdapat error saat menambahkan channel",
            ephemeral: true,
          })
        }
        break
      default:
        break
    }
  },
})
