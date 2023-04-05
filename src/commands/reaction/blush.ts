import { Command } from "../../structures/Command"
import { fetchGif } from "../../utils/fetchTenorGif"
import memcacheClient from "../../configs/memcached"
import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export default new Command({
  builder: new SlashCommandBuilder()
    .addUserOption((target) =>
      target
        .setName("target")
        .setDescription("Add target member to mention")
        .setRequired(false)
    )
    .setName("blush")
    .setDescription(
      "Mengirim sebuah reaksi blush berupa gif kepada target member"
    ),
  async run({ interaction, args }) {
    try {
      const cackeKey = "TENOR_GIF"
      const targetMember = args.getUser("target")
      let gifUrl: string

      const cacheGifUrl = await memcacheClient.get(cackeKey)

      const listGifUrl = JSON.parse(
        (cacheGifUrl?.value as string) ?? "[]"
      ) as string[]

      if (typeof listGifUrl[0] === "string" && listGifUrl.length !== 0) {
        gifUrl = listGifUrl[0]
        listGifUrl.shift()
        memcacheClient.set(cackeKey, JSON.stringify(listGifUrl), {
          lifetime: 120,
        })
      } else {
        const fetchGifUrl = await fetchGif({
          q: "anime blush shy",
          limit: 20,
          client_key: process.env.CLIENT_ID,
        })

        gifUrl = fetchGifUrl[0]
        fetchGifUrl.shift()

        memcacheClient.set(cackeKey, JSON.stringify(fetchGifUrl), {
          lifetime: 120,
        })
      }
      const embeds: Array<EmbedBuilder> = [
        new EmbedBuilder()
          .setColor(0x00feca)
          .setImage(gifUrl)
          .setFooter({
            text: "Powered by tenor.com",
            iconURL: "https://tenor.com/assets/img/favicon/favicon-16x16.png",
          })
          .setDescription(
            targetMember?.id && !(interaction.member.id === targetMember?.id)
              ? `Awww look at this, <@${targetMember.id}> has made <@${interaction.member.id}> blush, it's so cute`
              : `Awww <@${interaction.member.id}> is blushing, I wonder why hehehe`
          ),
      ]
      interaction.followUp({ embeds })
    } catch (error) {
      console.log(error)
      interaction.followUp({ content: "An error occurred", ephemeral: true })
    }
  },
})
