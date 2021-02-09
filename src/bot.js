require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const CronJob = require('cron').CronJob;
const spotifyAuth = require('./utils/spotifyAuth.js');
const processCommand = require('./utils/processCommand.js');
const addSong = require('./utils/addSong.js');

var tokenInfo;
spotifyAuth.refreshToken().then(data=>{ tokenInfo = data;});
var job = new CronJob('0,30 * * * *', function() {
  spotifyAuth.refreshToken().then(data=>{ tokenInfo = data;});
}, null, true, 'America/Chicago');
job.start();

const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  //create a new collection for loaded commands
  client.commands = new Discord.Collection();
  //load commands from ./commands
  const commandFiles = fs
    .readdirSync('./src/commands')
    .filter((file) => file.endsWith('.js'));
  //go through each file loaded and add to collection
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }
});

client.on('message', (msg) => {
  addSong(msg, tokenInfo);
  //run a command if the message starts with the command prefix, isn't sent by a bot, and is in the discord.
  if (msg.content.startsWith(process.env.COMMAND_PREFIX) && !msg.author.bot && msg.guild) {
    processCommand(msg, tokenInfo);
  }
});
