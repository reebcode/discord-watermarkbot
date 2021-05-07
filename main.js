const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '-';
const fs = require('fs');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});
client.login('ODM3NDY0NzU0MDIwNTQ4NjE4.YIs71A.TpAg_mSvfX6tej42YigcfEAEbkY');
//client.user.setActivity(`-help`, {type:"LISTENING"});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
	
    if (command === 'send') {
        if (args.length < 1) {
            return message.reply('Error not enough arguments. Structure is -send (@role/@user) (yes/no message) (yes/no watermark).  Message can also be an image attachment or a link! Watermark only functions for attached images and videos.')
        } 
        if (message.attachments.first()) {
            client.guilds.cache.get('837963162816741426').channels.cache.get('838584588024545311').send(message.attachments.first());
        }
        client.guilds.cache.get('837963162816741426').channels.cache.get('838584588024545311').send(message.toString());
        client.commands.get('send').execute(message, args, Discord);
    } else if (command === 'register') {
        client.commands.get('register').execute(message, args, Discord);
    }
});
