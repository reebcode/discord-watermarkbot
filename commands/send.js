module.exports = {
    name: 'send',
    description: "Use this command to send a message to a users private channel. Syntax -send (role) (message)",

    async execute(message, args, Discord) {
        const Canvas = require('canvas');
        let attachment = new Discord.MessageAttachment();
        //Check if image should be watermarked
        if (args.length === 3 || args[2] === 'watermark') {
            //Check for attachment
            if (message.attachments.first()) {
                let canvas;

                //Shrinks canvas down to fit in discord file limits if needed.
                if (message.attachments.first().width > 3000) {
                    canvas = Canvas.createCanvas(message.attachments.first().width / 1.5, message.attachments.first().height / 1.5);
                }
                else {
                    canvas = Canvas.createCanvas(message.attachments.first().width, message.attachments.first().height);
                }

                const ctx = canvas.getContext('2d');
                const background = await Canvas.loadImage(message.attachments.first().url)

                //Set font size based on a few image sizes;
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                if (message.attachments.first().width > 2500) {
                    ctx.font = "200px Arial";
                }
                else if (message.attachments.first().width > 2000) {
                    ctx.font = "150px Arial";
                }
                else if (message.attachments.first().width > 1500) {
                    ctx.font = "100px Arial";
                }
                else {
                    ctx.font = "50px Arial";
                }
                ctx.fillStyle = "rgba(255,255,255,0.7)"
                ctx.strokeStyle = "rgba(0,0,0,0.7)";
                // ctx.fillText(message.mentions.users.first().tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                // ctx.strokeText(message.mentions.users.first().tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                // attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'marked.jpeg');

                //Check & send to a mentioned user
                if (message.mentions.users.first()) {
                    let user = message.mentions.users.first().username.toLowerCase();
                    console.log("USER " + user);
                    user.replace(/\s+/g, '-');
                    console.log("REPLACED " + user);
                    let uid = message.mentions.users.first().id;
                    if (message.guild.channels.cache.find(channel => channel.name === user + "-private") != undefined) {
                        ctx.fillText(message.mentions.users.first().tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                        ctx.strokeText(message.mentions.users.first().tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                        attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'marked.jpeg');
                        message.guild.channels.cache.find(channel => channel.name === user + "-private").send(attachment);
                        message.delete();
                        message.reply('Sent!').then(r => r.delete({ timeout: 10000 }));
                    }
                    else {
                        message.guild.channels.create(user + '-private', {
                            permissionOverwrites: [
                                {
                                    id: message.guild.roles.everyone.id,
                                    deny: ['VIEW_CHANNEL']
                                }, {
                                    id: uid,
                                    allow: ['VIEW_CHANNEL'],
                                    deny: ['SEND_MESSAGES', 'CREATE_INSTANT_INVITE']
                                },
                            ]
                        }).then(channel => {
                            channel.setTopic(uid + " Your personal content channel.")
                            //Change to find the category ID;
                            channel.setParent('803461412755079188', { lockPermissions: false });
                            channel.setNSFW(true);
                            ctx.fillText(message.mentions.users.first().tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                            ctx.strokeText(message.mentions.users.first().tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                            attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'marked.jpeg');
                            message.guild.channels.cache.find(channel => channel.name === user + "-private").send(attachment);
                            message.delete();
                            message.reply('Sent!').then(r => r.delete({ timeout: 10000 }));
                        }).catch(err => console.error(err));
                    }
                }
                //Check & send to mentioned roles
                else if (message.mentions.roles.first()) {
                    await message.guild.members.fetch();
                    message.guild.members.cache.forEach(member => {
                        //Check if member has correct role
                        if (member.roles.cache.has(message.mentions.roles.first().id) && !member.user.bot) {
                            let user = member.user.username.toLowerCase();
                            user.replace(/\s+/g, '-');
                            let uid = member.user.id;
                            let tag = member.user.tag;
                            //Check if private channel exists & send if true
                            if (message.guild.channels.cache.find(channel => channel.name === user + "-private") != undefined) {
                                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                ctx.fillText(tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                                ctx.strokeText(tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                                attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'marked.jpeg');
                                message.guild.channels.cache.find(channel => channel.name === user + "-private").send(attachment);
                            }
                            //Creates private channel & sends.
                            else {
                                message.guild.channels.create(user + '-private', {
                                    permissionOverwrites: [
                                        {
                                            id: message.guild.roles.everyone.id,
                                            deny: ['VIEW_CHANNEL']
                                        }, {
                                            id: uid,
                                            allow: ['VIEW_CHANNEL'],
                                            deny: ['SEND_MESSAGES', 'CREATE_INSTANT_INVITE']
                                        },
                                    ]
                                }).then(channel => {
                                    channel.setTopic(uid + " Your personal content channel.")
                                    //Change to find the category ID;
                                    channel.setParent('803461412755079188', { lockPermissions: false });
                                    channel.setNSFW(true);
                                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                    ctx.fillText(tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                                    ctx.strokeText(tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                                    attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'marked.jpeg');
                                    message.guild.channels.cache.find(channel => channel.name === user + "-private").send(attachment);
                                }).catch(err => console.error(err));
                            }
                        }
                    })
                    //After loop
                    message.delete();
                    message.reply('Sent!').then(r => r.delete({ timeout: 10000 }));
                    console.log('done');
                }
                //If not @role/@member will send in same channel
                else {
                    ctx.fillText(message.author.tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                    ctx.strokeText(message.author.tag, canvas.width / 4, canvas.height / 2, message.attachments.first().width);
                    attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'marked.jpeg');
                    message.channel.send(attachment);
                    message.delete();
                }
            }
            else {
                return message.reply('Watermark only functions if a image or video is attached. Links will not work.');
            }
        }
        //No watermark CMDS
        else {
            if (args[1] === 'help') {
                return message.reply('Use this command to send a message to a users private channel. "-send (@role/@user) (yes/no message) (yes/no watermark)" If sending an attachment message is optional, watermark will add a watermark if left in.');
            }
            //Send MSG command -send @role/@mention yes
            else if (args.length === 2) {
                let filter = m => m.author.id === message.author.id
                let msgtoSend;
                //Waits for reply message to send out
                message.reply(`Please send the message you would like to be sent out`).then(r => r.delete({ timeout: 10000 }));
                message.channel.awaitMessages(filter, {
                    max : 1, 
                    time: 30000
                }).then(collected => {
                    msgtoSend = collected.first().content;
                    collected.first().delete({ timeout: 10000 });
                    sendMsg();
                }).catch(err => {
                    message.reply("Never recieved a reply, time expired.")
                })
                
                async function sendMsg() {
                    if (message.mentions.users.first()) {
                        let user = message.mentions.users.first().username.toLowerCase();
                        user.replace(/\s+/g, '-');
                        let uid = message.mentions.users.first().id;
                        if (message.guild.channels.cache.find(channel => channel.name === user + "-private") != undefined) {
                            message.guild.channels.cache.find(channel => channel.name === user + "-private").send(msgtoSend);
                            message.delete();
                            message.reply('Sent!').then(r => r.delete({ timeout: 10000 }));
                        }
                        else {
                            message.guild.channels.create(user + '-private', {
                                permissionOverwrites: [
                                    {
                                        id: message.guild.roles.everyone.id,
                                        deny: ['VIEW_CHANNEL']
                                    }, {
                                        id: uid,
                                        allow: ['VIEW_CHANNEL'],
                                        deny: ['SEND_MESSAGES', 'CREATE_INSTANT_INVITE']
                                    },
                                ]
                            }).then(channel => {
                                channel.setTopic(uid + " Your personal content channel.")
                                //Change to find the category ID;
                                channel.setParent('803461412755079188', { lockPermissions: false });
                                channel.setNSFW(true);
                                message.guild.channels.cache.find(channel => channel.name === user + "-private").send(msgtoSend);
                                message.delete();
                                message.reply('Sent!').then(r => r.delete({ timeout: 10000 }));
                            }).catch(err => console.error(err));
                        }
                    }
                    //Check & send to mentioned roles
                    else if (message.mentions.roles.first()) {
                        await message.guild.members.fetch();
                        message.guild.members.cache.forEach(member => {
                            //Check if member has correct role
                            if (member.roles.cache.has(message.mentions.roles.first().id) && !member.user.bot) {
                                let user = member.user.username.toLowerCase();
                                console.log("USER " + user);
                                user.replace(/\s+/g, '-');
                                console.log("REPLACED " + user);
                                let uid = member.user.id;
                                let tag = member.user.tag;
                                //Check if private channel exists & send if true
                                if (message.guild.channels.cache.find(channel => channel.name === user + "-private") != undefined) {
                                    message.guild.channels.cache.find(channel => channel.name === user + "-private").send(msgtoSend);
                                }
                                //Creates private channel & sends.
                                else {
                                    message.guild.channels.create(user + '-private', {
                                        permissionOverwrites: [
                                            {
                                                id: message.guild.roles.everyone.id,
                                                deny: ['VIEW_CHANNEL']
                                            }, {
                                                id: uid,
                                                allow: ['VIEW_CHANNEL'],
                                                deny: ['SEND_MESSAGES', 'CREATE_INSTANT_INVITE']
                                            },
                                        ]
                                    }).then(channel => {
                                        channel.setTopic(uid + " Your personal content channel.")
                                        //Change to find the category ID;
                                        channel.setParent('803461412755079188', { lockPermissions: false });
                                        channel.setNSFW(true);
                                        message.guild.channels.cache.find(channel => channel.name === user + "-private").send(msgtoSend);
                                    }).catch(err => console.error(err));
                                }
                            }
                        })
                        message.delete();
                        message.reply('Sent!').then(r => r.delete({ timeout: 10000 }));
                        console.log('done');
                    }
                }
            }
        }
    }
}