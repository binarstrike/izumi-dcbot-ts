import { Event } from "../structures/Event"
import openAI from "../configs/openai"
import prisma from "../configs/prisma"
import memcacheClient from "../configs/memcached"
import { client } from ".."
import { Message } from "discord.js"

const PAST_MESSAGES: number = 6
const regexMention: RegExp = /<(?:[^\d>]+|:[A-Za-z0-9]+:)[0-9]+>/g

export default new Event("messageCreate", async function (message) {
  if (message.author.bot) return
  else if (regexMention.test(message.content) || message?.interaction) return

  const cacheChannelId = await memcacheClient.get(message.guild.id)
  if (!cacheChannelId) {
    const channel = await prisma.channelConfiguration.findUnique({
      where: { idServer: message.guild.id },
    })
    await memcacheClient.set(message.guild.id, channel?.channelId, {
      lifetime: 90,
    })
    if (message.channel.id !== channel?.channelId) return
  } else if (message.channel.id !== cacheChannelId.value) return

  const fetchChannelMessages = await message.channel.messages.fetch({
    limit: PAST_MESSAGES,
    before: message.id,
  })

  let messages: Array<Message<boolean>> = Array.from(
    fetchChannelMessages.keys()
  ).map((key: string) => fetchChannelMessages.get(key))

  messages.unshift(message)

  //* filter pesan yang terdapat properti interaction seperti slash command dan pesan yang terdapat mention
  messages = messages.filter(
    (message) => !message?.interaction || !regexMention.test(message.content)
  )

  let users = [
    ...new Set([
      ...messages.map((m) => m.member?.user?.username),
      client.user.username,
    ]),
  ]

  const lastUser = users.pop()
  let prompt = `Berikut percakapan antara ${users.join(
    ", "
  )} dan ${lastUser}.\n\n`

  message.channel.sendTyping()

  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    // * bila di dalam pesan terdapat mention maka akan dilewati dan tidak dimasukan ke prompt
    if (regexMention.test(m.content)) continue
    prompt += `${m.author?.username}: ${m.content}\n`
  }
  prompt += `${client.user.username}:`

  const response = await openAI.createCompletion({
    prompt,
    model: "text-davinci-003",
    max_tokens: 1000,
    temperature: 0.9,
    top_p: 1,
    presence_penalty: 0.6,
    frequency_penalty: 0.0,
    //* stop: ["\n"], //* bot akan berhenti mengirim balasan/response jika terdapat karakter '\n' atau Enter
  })

  await message.channel.send(response.data.choices[0].text)
})
