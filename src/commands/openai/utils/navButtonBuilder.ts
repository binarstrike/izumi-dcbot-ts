import { ButtonBuilder, ButtonStyle } from "discord.js";

export function navButtonBuilder(buttonId: {
  buttonNextId: string;
  buttonPrevId: string;
}): (isEnabled: boolean) => ButtonBuilder[] {
  return (isEnabled: boolean) => [
    new ButtonBuilder()
      .setCustomId(buttonId.buttonPrevId)
      .setLabel("⏮️")
      .setStyle(ButtonStyle.Success)
      .setDisabled(!isEnabled),
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
      .setCustomId(buttonId.buttonNextId)
      .setLabel("⏭️")
      .setStyle(ButtonStyle.Success)
      .setDisabled(!isEnabled),
  ];
}
