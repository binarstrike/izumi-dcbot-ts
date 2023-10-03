import { Command } from "../../structures/Command";
import { memcache } from "../../libs";
import { MyLogger, ErrorEmbedGenerator, fetchGifUrl } from "../../utils";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { CACHE_KEY } from "../../consts";
import envConfig from "../../env.config";

const logger = new MyLogger("Command>reaction>blush");

export default new Command({
  builder: new SlashCommandBuilder()
    .addUserOption((target) =>
      target.setName("target").setDescription("Add target member to mention").setRequired(false),
    )
    .setName("blush")
    .setDescription("Mengirim sebuah reaksi blush berupa gif kepada target member"),
  async run({ interaction, args }) {
    try {
      const gifUrlCacheKey = CACHE_KEY.tenorGifUrl;
      const targetMember = args.getUser("target");
      let gifUrl: string;

      const cacheGifUrl = await memcache.get(gifUrlCacheKey);

      const listGifUrl = JSON.parse(cacheGifUrl.value?.toString() ?? "[]") as string[];

      if (typeof listGifUrl[0] === "string" && listGifUrl.length > 0) {
        gifUrl = listGifUrl[0];
        listGifUrl.shift();
        memcache.set(gifUrlCacheKey, JSON.stringify(listGifUrl));
      } else {
        const listGifUrl = await fetchGifUrl({
          q: "anime blush blushing shy red cheeks",
          limit: 50,
          client_key: envConfig.CLIENT_ID,
        });

        gifUrl = listGifUrl[0];
        listGifUrl.shift();

        memcache.set(gifUrlCacheKey, JSON.stringify(listGifUrl));
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
              : `Awww <@${interaction.member.id}> is blushing, I wonder why hehehe`,
          ),
      ];
      interaction.followUp({ embeds });
    } catch (error) {
      logger.error(error);
      interaction.followUp({
        embeds: [
          new ErrorEmbedGenerator(
            "An error occurred",
            error?.message ? error.message : "Unknown error",
          ),
        ],
        ephemeral: true,
      });
    }
  },
});
