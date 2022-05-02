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

client.login('')
client.options.restRequestTimeout = 30000
client.options.retryLimit = Infinity

client.on('message', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const userCommand = args.shift()?.toLowerCase()

    if (userCommand === 'sendimg') {
        console.log(message.content)
        sendimg(message, args, client)
        //commands.get("sendimg").execute(message, args, client);
    } else if (userCommand === 'clear') {
        clear(message, args, client)
    }
})
