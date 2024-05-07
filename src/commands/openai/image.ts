import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { Command } from "../../structures/Command";
import { generateEmbedForImage as generateEmbedImage, navButtonBuilder } from "./utils";
import { ImageGenerateParams } from "openai/resources";
import { newLogger, openai } from "../../libs";

const logger = newLogger("Command:openai:image");

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
    .setDescription("Command utility for image generation"),
  async run({ interaction, args }) {
    switch (args.getSubcommand()) {
      case "generate":
        try {
          await interaction.followUp("Tunggu bentar ya...");

          const imageGenerationOptions: ImageGenerateParams = {
            prompt: args.getString("prompt"),
            n: args.getNumber("n", false) ?? 1,
            size: (args.getString("size", false) ?? "256x256") as ImageGenerateParams["size"],
          };

          const generatedImageURLs = (
            await openai.images.generate(imageGenerationOptions)
          ).data.map((data) => data.url);

          const navButtonId = {
            buttonNextId: `next-${crypto.randomUUID()}`,
            buttonPrevId: `prev-${crypto.randomUUID()}`,
          } satisfies Parameters<typeof navButtonBuilder>[0];

          const navButtons = navButtonBuilder(navButtonId);
          const rowComponents = {
            normal: new ActionRowBuilder<ButtonBuilder>().addComponents(...navButtons(true)),
            disabled: new ActionRowBuilder<ButtonBuilder>().addComponents(...navButtons(false)),
          };

          await interaction.editReply({
            content: "",
            embeds: [generateEmbedImage(generatedImageURLs[0], imageGenerationOptions)],
            components: [rowComponents.normal],
          });
          const collector = interaction.channel.createMessageComponentCollector({
            time: 60000 * 10,
          });

          let page: number = 1;
          const maxPage: number = generatedImageURLs.length - 1;

          collector.on("collect", async function (collectorInteraction) {
            switch (collectorInteraction.customId) {
              case navButtonId.buttonNextId:
                if (page > maxPage) page = 0;
                collectorInteraction.update({
                  embeds: [generateEmbedImage(generatedImageURLs[page], imageGenerationOptions)],
                });
                page += 1;
                break;
              case navButtonId.buttonPrevId:
                if (page < 0) page = maxPage;
                collectorInteraction.update({
                  embeds: [generateEmbedImage(generatedImageURLs[page], imageGenerationOptions)],
                });
                page -= 1;
                break;
              default:
                break;
            }
          });
          collector.on("end", () => {
            interaction.editReply({
              components: [rowComponents.disabled],
            });
          });
        } catch (error) {
          logger.error(error);
        }
        break;
    }
  },
});
