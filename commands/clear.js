module.exports = {
    name: 'clear',
    description: "Use this command to clear channels of users who left the server.",
    async execute(message, args, Discord) {
        await message.guild.members.fetch();
        message.guild.channels.cache.forEach((channel)=>{
            if (channel.name.indexOf('private') != -1 && channel.topic != undefined) {
                if (!message.guild.members.cache.has(channel.topic.slice(0, channel.topic.indexOf(" ")))) {
                    channel.delete();
                }
            }
        }) 
    }
} 
