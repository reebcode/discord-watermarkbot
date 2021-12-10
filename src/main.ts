import { Client, Collection } from 'discord.js'
import fs from 'fs'
import { clear } from './commands/clear'
import { sendimg } from './commands/sendimg'

const client = new Client()
const prefix = '-'

client.on('ready', () => {
    console.log('Ready!')
})

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error)
})

client.login('ODM3NDY0NzU0MDIwNTQ4NjE4.YIs71A.TpAg_mSvfX6tej42YigcfEAEbkY')
client.options.restRequestTimeout = 30000
//client.user.setActivity(`-help`, {type:"LISTENING"});

client.on('message', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const userCommand = args.shift()?.toLowerCase()

    if (userCommand === 'sendimg') {
        const targetChannel = client.guilds.cache.get('837963162816741426')?.channels.cache.get('838584588024545311')
        if (targetChannel?.isText()) {
            const msgAttachment = message.attachments.first()
            targetChannel.send(msgAttachment ?? 0)
        }
        console.log(message.content)
        sendimg(message, args, client)
        //commands.get("sendimg").execute(message, args, client);
    } else if (userCommand === 'clear') {
        clear(message, args, client)
    }
})
