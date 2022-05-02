// name: 'sendimg',
// description: "Use this command to send a message to a users private channel. Syntax -send (role) (message)",

import { Message, Client, MessageAttachment, User, GuildMember, Collection, Guild, TeamMember } from 'discord.js'
import { CanvasRenderingContext2D } from 'canvas'
import fs from 'fs'


export async function sendimg(message: Message, args: string[], client: Client) {
    //Canvas setup
    const Canvas = require('canvas')
    let canvas: {
        getContext: (arg0: string) => CanvasRenderingContext2D
        width: number
        height: number
        toBuffer: () => any
    }
    //Modify canvas to accomodate discord file size limit.
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

        //Set font size based on a few image sizes
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
        
        //Verify tagged role exists and begin
        const firstRole = message.mentions.roles.first()
        if (firstRole && message.guild) {
            await message.guild.members.fetch()
            await message.guild.roles.fetch()
            //Loop through each member, and store each user id that has corresponsing roles.
            let UIDs: string[] = []
            message.guild.members.cache.forEach((member) => {
                if ((member.roles.cache.has(firstRole.id) || higherRole(firstRole.id, member) == true) && !member.user.bot) {
                    UIDs.push(member.user.id)
                }
            })

            //Map each UID to appropriate private channel ID
            let y = 0
            let userChannelMap = new Map<string, string>()
            message.guild?.channels.cache.forEach((channel) => {
                if (channel && channel.isText() && channel.topic) {
                    let idTopic = channel.topic.split(' ')
                    if (UIDs.includes(idTopic[0])) {
                        userChannelMap.set(UIDs[y], channel.id)
                        y++
                    }
                }
            })

            //Create attachment, load background to be watermarked
            const msgAttachment = message.attachments.first()
            const background = await Canvas.loadImage(msgAttachment?.url)
            //Create images
            let i = 0
            for (i = 0; i < UIDs.length; i++) {
                //Get user
                let userID = message.guild?.members.cache.get(UIDs[i]);
                if (msgAttachment && msgAttachment.width && userID) {
                    //Draw watermark
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
                    ctx.fillText(userID.user.tag, canvas.width / 4, canvas.height / 2, msgAttachment.width)
                    ctx.strokeText(userID.user.tag, canvas.width / 4, canvas.height / 2, msgAttachment.width)
                    //Send image to corresponding channel
                    let attachment = new MessageAttachment(canvas.toBuffer(), 'marked.jpeg')
                    const targetChannel = message.guild?.channels.cache.get(userChannelMap.get(UIDs[i])!)
                    if (targetChannel?.isText()) {
                        console.log('send')
                        targetChannel.send(attachment)
                    }
                }
            }

            //If all goes well
            if (i == UIDs.length) {
                message.delete()
                message.reply('Sending complete!').then((r) => r.delete({ timeout: 10000 }))
            }
        }

        // if (success) {
        //     message.delete()
        //     message
        //         .reply('Sending! If this is going out to a large amount of users it may take a minute before it begins, please be patient.')
        //         .then((r) => r.delete({ timeout: 10000 }))
        // }

    }

    //Creates private channels, TODO: make this a seperate command.
    function createChannel(member: GuildMember, message: Message, ctx: CanvasRenderingContext2D, msgSent: Boolean) {
        let user = member.id
        //Create channel with appropriate permissions
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
                //Set channel topic with user ID
                channel.setTopic(user + ' Your personal content channel.')
                //TODO: Auto expand categories
                //Set permissions and parent category
                channel
                    .setParent('803461412755079188', {
                        lockPermissions: false,
                    })
                    .catch((err) => console.error(err))
                if (!msgSent) {
                    msgSent = true
                    //sendMsg(member, message, ctx, channel.id)
                }
            })
            .catch((err) => console.error(err))
    }

    //Automatically send to higher roles
    function higherRole(currRole: string, member: GuildMember) {
        //let ranks = ['880539525825306685', '882118125926105138']
        //TODO: Auto generate higher roles array
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