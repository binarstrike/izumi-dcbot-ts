import { Command } from "../../structures/Command"
import generateImageUrl from "./utils/generateImageUrl"
import generateEmbedForImage from "./utils/generateEmbedForImage"
import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"

export default new Command({
  builder: new SlashCommandBuilder()
    .addSubcommand((generate) =>
      generate
        .setName("generate")
        .setDescription(
          "Membuat sebuah gambar dengan input prompt berupa kalimat yang mendeskripsikan gambar"
        )
        .addStringOption((prompt) =>
          prompt
            .setName("prompt")
            .setDescription("Prompt berupa kalimat yang mendeskripsikan gambar")
            .setRequired(true)
        )
        .addNumberOption((n) =>
          n
            .setName("n")
            .setDescription(
              "Jumlah gambar yang akan dibuat, max: 10 default: 1"
            )
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(false)
        )
        .addStringOption((size) =>
          size
            .setName("size")
            .setDescription("Ukuran gambar, max: 1024x1024, default: 256x256")
            .addChoices(
              { name: "256x256", value: "256x256" },
              { name: "512x512", value: "512x512" },
              { name: "1024x1024", value: "1024x1024" }
            )
            .setRequired(false)
        )
    )
    .setName("image")
    .setDescription("Image generations command utility"),
  async run({ interaction, args }) {
    switch (args.getSubcommand()) {
      case "generate":
        try {
          await interaction.followUp("Tunggu bentar ya...")
          const listImageUrl = await generateImageUrl(args)

          function buttons(enable: boolean): Array<ButtonBuilder> {
            return [
              new ButtonBuilder()
                .setCustomId("previous")
                .setLabel("⏮️")
                .setStyle(ButtonStyle.Success)
                .setDisabled(!enable),
              new ButtonBuilder()
                .setLabel("🟦")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
                .setCustomId("foo"),
              new ButtonBuilder()
                .setLabel("🟦")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
                .setCustomId("bar"),
              new ButtonBuilder()
                .setCustomId("next")
                .setLabel("⏭️")
                .setStyle(ButtonStyle.Success)
                .setDisabled(!enable),
            ]
          }
          const rowComponents = {
            normal: new ActionRowBuilder<ButtonBuilder>().addComponents(
              ...buttons(true)
            ),
            disabled: new ActionRowBuilder<ButtonBuilder>().addComponents(
              ...buttons(false)
            ),
          }

          await interaction.editReply({
            content: "",
            embeds: [generateEmbedForImage(listImageUrl[0])],
            components: [rowComponents.normal],
          })
          const collector = interaction.channel.createMessageComponentCollector(
            { time: 15000 }
          )

          let page: number = 1
          const maxPage: number = listImageUrl.length - 1

          collector.on("collect", async function (collectorInteraction) {
            switch (collectorInteraction.customId) {
              case "next":
                if (page > maxPage) page = 0
                collectorInteraction.update({
                  embeds: [generateEmbedForImage(listImageUrl[page])],
                })
                page += 1
                break
              case "previous":
                if (page < 0) page = maxPage
                collectorInteraction.update({
                  embeds: [generateEmbedForImage(listImageUrl[page])],
                })
                page -= 1
                break
              default:
                break
            }
          })
          collector.on("end", async function () {
            interaction.editReply({
              components: [rowComponents.disabled],
            })
          })
        } catch (error) {
          console.log(error)
          interaction.editReply({
            content: "❌Error when handling slash command❌",
          })
        }
        break
    }
  },
})
