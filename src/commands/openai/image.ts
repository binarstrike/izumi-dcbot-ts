import { Command } from "../../structures/Command";
import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { generateEmbedForImage, navButtonBuilder } from "./utils";
import { MyLogger } from "../../utils";
import { ImageGenerateParams } from "openai/resources";
import { openai } from "../../libs";
import { randomBytes } from "crypto";

const logger = new MyLogger("Command>openai>image");

export default new Command({
  builder: new SlashCommandBuilder()
    .addSubcommand((generate) =>
      generate
        .setName("generate")
        .setDescription(
          "Membuat sebuah gambar dengan input prompt berupa kalimat yang mendeskripsikan gambar",
        )
        .addStringOption((prompt) =>
          prompt
            .setName("prompt")
            .setDescription("Prompt berupa kalimat yang mendeskripsikan gambar")
            .setRequired(true),
        )
        .addNumberOption((n) =>
          n
            .setName("n")
            .setDescription("Jumlah gambar yang akan dibuat, max: 10 default: 1")
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(false),
        )
        .addStringOption((size) =>
          size
            .setName("size")
            .setDescription("Ukuran gambar, max: 1024x1024, default: 256x256")
            .addChoices(
              { name: "256x256", value: "256x256" },
              { name: "512x512", value: "512x512" },
              { name: "1024x1024", value: "1024x1024" },
            )
            .setRequired(false),
        ),
    )
    .setName("image")
    .setDescription("Image generations command utility"),
  async run({ interaction, args }) {
    switch (args.getSubcommand()) {
      case "generate":
        try {
          await interaction.followUp("Tunggu bentar ya...");

          const imageGenerateOpts: ImageGenerateParams = {
            prompt: args.getString("prompt"),
            n: args.getNumber("n", false) ?? 1,
            size: (args.getString("size", false) ?? "256x256") as ImageGenerateParams["size"],
          };

          const listGenerateImageUrl = (await openai.images.generate(imageGenerateOpts)).data.map(
            (data) => data.url,
          );

          const navButtonCustomId = {
            buttonNextId: `next-${randomBytes(3).toString("hex")}`,
            buttonPrevId: `prev-${randomBytes(3).toString("hex")}`,
          } satisfies Parameters<typeof navButtonBuilder>[0];

          const navButtons = navButtonBuilder(navButtonCustomId);
          const rowComponents = {
            normal: new ActionRowBuilder<ButtonBuilder>().addComponents(...navButtons(true)),
            disabled: new ActionRowBuilder<ButtonBuilder>().addComponents(...navButtons(false)),
          };

          await interaction.editReply({
            content: "",
            embeds: [generateEmbedForImage(listGenerateImageUrl[0], imageGenerateOpts)],
            components: [rowComponents.normal],
          });
          const collector = interaction.channel.createMessageComponentCollector({
            time: 60000 * 10,
          });

          let page: number = 1;
          const maxPage: number = listGenerateImageUrl.length - 1;

          collector.on("collect", async function (collectorInteraction) {
            switch (collectorInteraction.customId) {
              case navButtonCustomId.buttonNextId:
                if (page > maxPage) page = 0;
                collectorInteraction.update({
                  embeds: [generateEmbedForImage(listGenerateImageUrl[page], imageGenerateOpts)],
                });
                page += 1;
                break;
              case navButtonCustomId.buttonPrevId:
                if (page < 0) page = maxPage;
                collectorInteraction.update({
                  embeds: [generateEmbedForImage(listGenerateImageUrl[page], imageGenerateOpts)],
                });
                page -= 1;
                break;
              default:
                break;
            }
          });
          collector.on("end", async function () {
            interaction.editReply({
              components: [rowComponents.disabled],
            });
          });
        } catch (error) {
          logger.error(error);
          interaction.editReply({
            content: "❌Error when handling slash command❌",
          });
        }
        break;
    }
  },
});
