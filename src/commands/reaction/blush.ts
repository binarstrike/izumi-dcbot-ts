import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { newLogger, memcache } from "../../libs";
import { fetchGIF } from "../../utils";
import { cacheKey } from "../../consts";

const logger = newLogger("Command>reaction>blush");

export default new Command({
  builder: new SlashCommandBuilder()
    .addUserOption((target) =>
      target.setName("target").setDescription("Add target member to mention").setRequired(false),
    )
    .setName("blush")
    .setDescription("Send a blush reaction to the target member"),
  async run({ interaction, args }) {
    try {
      const targetMember = args.getUser("target", false);

      let GIFImage: string;

      const cachedGIFURLs = await memcache.get(cacheKey.tenorGIFURL);

      const GIFURLs = JSON.parse(cachedGIFURLs.value?.toString() ?? "[]") as string[];

      if (GIFURLs.length > 0) {
        GIFImage = GIFURLs[0];
        GIFURLs.shift();
        memcache.set(cacheKey.tenorGIFURL, JSON.stringify(GIFURLs));
      } else {
        const GIFURLs = await fetchGIF({
          q: "anime blush blushing shy red cheeks",
          limit: "50",
          client_key: process.env.CLIENT_ID,
        });

        GIFImage = GIFURLs[0];
        GIFURLs.shift();

        memcache.set(cacheKey.tenorGIFURL, JSON.stringify(GIFURLs));
      }

      const reactionEmbed = new EmbedBuilder()
        .setColor(0x00feca)
        .setImage(GIFImage)
        .setFooter({
          text: "Powered by tenor.com",
          iconURL: "https://tenor.com/assets/img/favicon/favicon-16x16.png",
        })
        .setDescription(
          targetMember?.id && !(interaction.member.id === targetMember?.id)
            ? `Awww look at this, <@${targetMember.id}> has made <@${interaction.member.id}> blush, it's so cute`
            : `Awww <@${interaction.member.id}> is blushing, I wonder why hehehe`,
        );

      await interaction.editReply({ embeds: [reactionEmbed] });
    } catch (error) {
      logger.error(error);
    }
  },
});
