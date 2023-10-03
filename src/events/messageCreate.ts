import { Event } from "../structures/Event";
import { openai, prisma, memcache } from "../libs";
import { ErrorEmbedGenerator, MyLogger } from "../utils";
import { client } from "../main";
import { CACHE_KEY, REGEXP_MENTION } from "../consts";
import { APIError } from "openai";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const PAST_MESSAGES_COUNT = 6;
const logger = new MyLogger("Events>messageCreate");

export default new Event("messageCreate", async function (message) {
  if (message.author.bot) return;
  else if (REGEXP_MENTION.test(message.content) || message.interaction) return;

  const chatGptChannelIdCacheKey = CACHE_KEY.chatGptChannelId`${message.guildId}`;
  const chatGptChannelId = (await memcache.get(chatGptChannelIdCacheKey)).value?.toString();

  //* cek jika id dari channel chat gpt terdapat pada cache memory
  if (!chatGptChannelId) {
    try {
      const findChannel = await prisma.guild.findUniqueOrThrow({
        where: { guildId: message.guild.id },
        include: { configData: true },
      });
      await memcache.set(chatGptChannelIdCacheKey, findChannel.configData?.chatGptChannelId, {
        expires: 60 * 30,
      });
      //* jika id channel yang di input oleh member berbeda dengan id channel
      //* yang terdapat pada cache memory atau database maka fungsi akan diakhiri atau dilewati
      if (message.channel.id !== findChannel.configData?.chatGptChannelId) return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        logger.error(error.message);
        return;
      }
      logger.error(error);
      return;
    }
  } else if (message.channel.id !== chatGptChannelId) return;

  //* mengambil riwayat pesan pada text channel sebanyak berdasarkan variabel `PAST_MESSAGES_COUNT`
  const fetchMessages = await message.channel.messages.fetch({
    limit: PAST_MESSAGES_COUNT,
    before: message.id,
  });

  //* mengubah pesan yang sudah diambil dari text channel dari bentuk key-value Message Collection
  //* menjadi array dengan elemen Message
  let messages = Array.from(fetchMessages.keys()).map((key: string) => fetchMessages.get(key));

  messages.unshift(message);

  //* filter pesan yang terdapat properti interaction seperti slash command dan pesan yang terdapat mention
  messages = messages.filter(
    (message) => !message?.interaction || !REGEXP_MENTION.test(message.content),
  );

  //* mengambil dan menyimpan nama dari setiap member pada riwayat pesan yang diambil
  const users = [
    ...new Set([
      ...messages.map((message) => message?.author?.username || message?.member?.user?.username),
      client.user.username,
    ]),
  ].reverse();

  const lastUser = users.pop();
  let prompt = `Berikut percakapan antara ${users.join(", ")} dan ${lastUser}.\nkamu adalah ${
    client.user.username
  }. Kamu hanya perlu menjawab dialog bagian mu pada percakapan berikut:\n`;
  await message.channel.sendTyping();

  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    // * bila di dalam pesan terdapat mention maka akan dilewati dan tidak dimasukan ke prompt
    // if (regexMention.test(m.content)) continue;
    prompt += `${m.author?.username}: ${m.content}\n`;
  }
  prompt += `${client.user.username}:`;

  try {
    const textCompletionsResponse = await openai.completions.create({
      prompt,
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 1000,
      temperature: 0.9,
      top_p: 1,
      presence_penalty: 0.6,
      frequency_penalty: 0.0,
    });

    message.channel.send(textCompletionsResponse.choices[0].text);
  } catch (error) {
    if (error instanceof APIError) {
      const errorEmbedMessage = new ErrorEmbedGenerator("Openai API error", error.message);
      message.reply({ embeds: [errorEmbedMessage], options: { ephemeral: true } });
      logger.error(error.message);
      return;
    }
    message.reply({
      embeds: [new ErrorEmbedGenerator("An error occured", error)],
      options: { ephemeral: true },
    });
    logger.error(error);
  }
});
