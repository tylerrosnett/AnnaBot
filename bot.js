const Discord = require("discord.js");
const client = new Discord.Client();

client.login("");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  console.log(msg.channel.id);

  if (msg.channel.id == 463542227487162383) {
  } else if (msg.channel.id == 415259049442148365) {
    if (msg.content === "What is my purpose?") {
      msg.reply("You pass butter.");
    }
    if (msg.content === "Oh my god.") {
      msg.reply("Yeah. Welcome to the club, pal.");
    }
  }
});
