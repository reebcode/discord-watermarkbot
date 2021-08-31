import { Client, Collection } from 'discord.js'
import fs from 'fs'
import { clear } from './commands/clear'
import { sendimg } from './commands/sendimg'

const client = new Client()
const prefix = '-'

client.on('ready', () => {
    console.log('Ready!')
})
client.login('ODM3NDY0NzU0MDIwNTQ4NjE4.YIs71A.TpAg_mSvfX6tej42YigcfEAEbkY')
//client.user.setActivity(`-help`, {type:"LISTENING"});

client.on('message', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const userCommand = args.shift()?.toLowerCase()

    if (userCommand === 'send') {
        if (args.length < 1) {
            return message.reply(
                'Error not enough arguments. Structure is -send (@role/@user) (yes/no message) (yes/no watermark).  Message can also be an image attachment or a link! Watermark only functions for attached images and videos.'
            )
        }
        // if (message.attachments.first()) {
        //     client.guilds.cache.get('837963162816741426').channels.cache.get('838584588024545311').send(message.attachments.first());
        // }
        const targetChannel = client.guilds.cache.get('837963162816741426')?.channels.cache.get('838584588024545311')
        if (targetChannel?.isText()) {
            targetChannel.send(message.toString())
        }
        clear(message, args, client)
    } else if (userCommand === 'register') {
        //commands.get("register").execute(message, args, client);
    } else if (userCommand === 'sendimg') {
        sendimg(message, args, client)
        //commands.get("sendimg").execute(message, args, client);
    } else if (userCommand === 'clear') {
        //commands.get("clear").execute(message, args, client);
    }
})
