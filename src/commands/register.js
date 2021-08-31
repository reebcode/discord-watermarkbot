module.exports = {
  name: "register",
  description: "Use this command to create your content channel.",
  async execute(message, args, Discord) {
    message.guild.channels
      .create(message.author.username + "-private", {
        permissionOverwrites: [
          {
            id: message.guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: message.author.id,
            allow: ["VIEW_CHANNEL"],
            deny: ["SEND_MESSAGES", "CREATE_INSTANT_INVITE"],
          },
        ],
      })
      .then((channel) => {
        channel.setTopic(message.author.id + " Your personal content channel.");
        //Change to find the category ID;
        channel.setParent("803461412755079188", { lockPermissions: false });
        channel.setNSFW(true);
      })
      .catch((err) => console.error(err));
  },
};
