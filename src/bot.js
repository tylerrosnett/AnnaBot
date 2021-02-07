require('dotenv').config();
const Discord = require("discord.js");
const processCommand = require('./processCommand.js');
const fs = require('fs');

const client = new Discord.Client();


client.login(process.env.DISCORD_TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  //create a new collection for loaded commands
  client.commands = new Discord.Collection();
  //load commands from ./commands
  const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
  //go through each file loaded and add to collection
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
  }
});

client.on("message", (msg) => {


  //run a command if the message starts with the command prefix, isn't sent by a bot, and is in the discord.
  if (msg.content.startsWith(process.env.COMMAND_PREFIX) && !msg.author.bot && msg.guild) {
    processCommand(msg);
  };
  
});