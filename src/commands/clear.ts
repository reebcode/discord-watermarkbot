import { Client, Message, TextChannel } from 'discord.js'

// name: 'clear',
// description: "Use this command to clear channels of users who left the server.",

export async function clear(message: Message, args: string[], client: Client) {
    await message.guild?.members.fetch()
    message.guild?.channels.cache.forEach((channel) => {
        if (channel.name.indexOf('private') != -1) {
            if (channel.isText() && channel.topic) {
                if (!message.guild?.members.cache.has(channel.topic.slice(0, channel.topic.indexOf(' ')))) {
                    channel.delete()
                }
            }
        }
    })
}
