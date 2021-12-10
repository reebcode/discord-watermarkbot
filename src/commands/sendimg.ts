// name: 'sendimg',
// description: "Use this command to send a message to a users private channel. Syntax -send (role) (message)",

import { Message, Client, MessageAttachment, User, GuildMember, Collection, Guild, TeamMember } from 'discord.js'
import { CanvasRenderingContext2D } from 'canvas'

export async function sendimg(message: Message, args: string[], client: Client) {
    //Sets up canvas for watermark
    const Canvas = require('canvas')
    let canvas: {
        getContext: (arg0: string) => CanvasRenderingContext2D
        width: number
        height: number
        toBuffer: () => any
    }
    //Shrinks canvas down to fit in discord file limits if needed.
    const firstMsg = message.attachments.first()
    if (firstMsg && firstMsg.width && firstMsg.height) {
        if (firstMsg.width > 3000) {
            canvas = Canvas.createCanvas(firstMsg.width / 1.5, firstMsg.height / 1.5)
        } else {
            canvas = Canvas.createCanvas(firstMsg.width, firstMsg.height)
        }

        //Canvas Variables
        const ctx = canvas.getContext('2d')
        const background = await Canvas.loadImage(firstMsg.url)

        //Set font size based on a few image sizes;
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
        if (firstMsg.width > 3000) {
            ctx.font = '250px Arial'
        } else if (firstMsg.width > 2500) {
            ctx.font = '200px Arial'
        } else if (firstMsg.width > 2000) {
            ctx.font = '150px Arial'
        } else if (firstMsg.width > 1500) {
            ctx.font = '100px Arial'
        } else {
            ctx.font = '50px Arial'
        }
        //Font Color & Stroke
        ctx.fillStyle = 'rgba(255,255,255,0.7)'
        ctx.strokeStyle = 'rgba(0,0,0,0.7)'
        //Begins checking mentions
        //Refetch members, roles
        const firstRole = message.mentions.roles.first()
        let success = false
        if (firstRole && message.guild) {
            await message.guild.members.fetch()
            await message.guild.roles.fetch()
            //Checks each member
            message.guild.members.cache.forEach(async (member) => {
                //console.log(member.user)
                //Variable for creating channels
                let msgSent = false
                //Check if member has correct role
                if ((member.roles.cache.has(firstRole.id) || higherRole(firstRole.id, member) == true) && !member.user.bot) {
                    let i = 0
                    //Check each channel for matching ID in topic
                    message.guild?.channels.cache.forEach(async (channel) => {
                        i++
                        if (channel && channel.isText() && channel.topic) {
                            let idTopic = channel.topic.split(' ')
                            if (idTopic[0] == member.id && !msgSent) {
                                const CID = channel.id
                                //console.log('top')
                                msgSent = true
                                success = true
                                await sendMsg(member, message, ctx, CID)
                            }
                        }
                        //Create channel if reached end of collection and not found
                        if (i == message.guild?.channels.cache.size && !member.user.bot) {
                            if (!msgSent) {
                                //console.log('bot')
                                createChannel(member, message, ctx, msgSent)
                                msgSent = true
                                success = true
                            }
                        }
                    })
                }
            })
        }
        if (success) {
            message.delete()
            message
                .reply('Sending! If this is going out to a large amount of users it may take a minute before it begins, please be patient.')
                .then((r) => r.delete({ timeout: 10000 }))
        }
    }

    //Sends msg with attachment
    async function sendMsg(member: GuildMember, message: Message, ctx: CanvasRenderingContext2D, CID: string) {
        let user = member.id
        const msgAttachment = message.attachments.first()
        if (msgAttachment && msgAttachment.width) {
            const background = await Canvas.loadImage(msgAttachment.url)
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
            ctx.fillText(member.user.tag, canvas.width / 4, canvas.height / 2, msgAttachment.width)
            ctx.strokeText(member.user.tag, canvas.width / 4, canvas.height / 2, msgAttachment.width)
            let attachment = new MessageAttachment(canvas.toBuffer(), 'marked.jpeg')
            const targetChannel = message.guild?.channels.cache.get(CID)
            if (targetChannel?.isText()) {
                await targetChannel.send(attachment)
            }
        }
    }

    //Creates private channel
    function createChannel(member: GuildMember, message: Message, ctx: CanvasRenderingContext2D, msgSent: Boolean) {
        let user = member.id
        message.guild?.channels
            .create(member.user.username + '-private', {
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: user,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['CREATE_INSTANT_INVITE'],
                    },
                ],
            })
            .then((channel) => {
                channel.setTopic(user + ' Your personal content channel.')
                //Change to find the category ID;
                channel
                    .setParent('803461412755079188', {
                        lockPermissions: false,
                    })
                    .catch((err) => console.error(err))
                channel.setNSFW(true)
                if (!msgSent) {
                    msgSent = true
                    sendMsg(member, message, ctx, channel.id)
                }
            })
            .catch((err) => console.error(err))
    }

    //Sends to higher roles
    function higherRole(currRole: string, member: GuildMember) {
        //ALPHA, ANGEL, GOD, VOID, HCIGBTT
        //let ranks = ['880539525825306685', '882118125926105138']
        let ranks = ['773034879620874322', '773035077067735061', '773035250849677314', '773035399262109728', '786628196002037770']
        if (ranks.includes(currRole)) {
            var i = ranks.indexOf(currRole) + 1
            for (i; i < ranks.length; i++) {
                if (member.roles.cache.has(ranks[i])) {
                    //console.log('Higher role')
                    return true
                }
                //console.log('No higher role')
            }
        }
        //console.log('Probably not a user')
    }
}
