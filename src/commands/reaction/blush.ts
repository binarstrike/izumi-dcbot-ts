import { Command } from "../../structures/Command"
import { fetchGif } from "../../utils/fetchTenorGif"
import memcacheClient from "../../configs/memcached"
import ErrorEmbedGenerator from "../../utils/ErrorEmbedGenerator"
import MyLogger from "../../utils/MyLogger"
import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

const logger = new MyLogger("Command>reaction>blush")

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
        logger.info("use cache for GIF url")
        gifUrl = listGifUrl[0]
        listGifUrl.shift()
        memcacheClient.set(cackeKey, JSON.stringify(listGifUrl), {
          lifetime: 60 * 30,
        })
      } else {
        logger.info("fetching Tenor GIF API for GIF url")
        const fetchGifUrl = await fetchGif({
          q: "anime blush shy",
          limit: 50,
          client_key: process.env.CLIENT_ID,
        })

        gifUrl = fetchGifUrl[0]
        fetchGifUrl.shift()

        memcacheClient.set(cackeKey, JSON.stringify(fetchGifUrl), {
          lifetime: 60 * 30,
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
      logger.error(error.message)
      interaction.followUp({
        embeds: [
          new ErrorEmbedGenerator(
            "An error occurred",
            error?.message ? error.message : "Unknown error"
          ),
        ],
        ephemeral: true,
      })
    }
  },
})
