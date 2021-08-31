module.exports = {
  name: "updateRoles",
  description: "Automates adding roles below highest tier.",

  async execute(message, args, Discord) {
    //ALPHA, ANGEL, GOD, VOID, HCIGBTT
    let ranks = [
      "773034879620874322",
      "773035077067735061",
      "773035250849677314",
      "773035399262109728",
      "786628196002037770",
    ];
    await message.guild.members.fetch();
    message.guild.members.cache.forEach((member) => {
      if (
        member.roles.cache.has(message.mentions.roles.first().id) ||
        higherRole(message.mentions.roles.first().id, member) != undefined
      ) {
        console.log(
          member.user.username.toLowerCase().split(" ").join("-") +
            "has higher."
        );
      }
    });
    function higherRole(currRole, memb) {
      //ALPHA, ANGEL, GOD, VOID, HCIGBTT
      let ranks = [
        "773034879620874322",
        "773035077067735061",
        "773035250849677314",
        "773035399262109728",
        "786628196002037770",
      ];
      if (ranks.includes(currRole)) {
        var i = ranks.indexOf(currRole) + 1;
        for (i; i <= 4; i++) {
          if (memb.roles.cache.has(ranks[i])) {
            return true;
          }
        }
      } else {
        return false;
      }
    }
  },
};
