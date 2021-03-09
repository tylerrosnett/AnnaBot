const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Reads off all the commands and what they do.',
  execute(msg) {
    //make an embed for the help panel
    let embed = new Discord.MessageEmbed()
      .setTitle('Command Help')
      .setDescription('');
    //go through each initialized command and add it to the embed
    msg.client.commands.forEach((cmd) => {
      let fieldString = '';
      //go through each potential property and list it if it's in
      if (cmd.description) {
        fieldString += `\n\`Description:\` ${cmd.description}`;
      }
      //usage examples
      if (cmd.example) {
        //differentiate between a single example and multiple
        if (Array.isArray(cmd.example) === true) {
          fieldString += '\n`Examples:`';
          cmd.example.forEach(example => {
            fieldString += `\n${example}`
          });
        } else if (cmd.example?.length > 0) {
          fieldString += `\n\`Example:\` ${cmd.example}`;
        }
      }
      //aliases
      if (cmd.aliases && cmd.aliases.length > 0) {
        fieldString += `\n\`Aliases:\` ${cmd.aliases.join(', ')}`;
      }
      //required permissions
      if (cmd.requiredPermissions && cmd.requiredPermissions.length > 0) {
        fieldString += `\n\`Needed Permissions:\` ${cmd.requiredPermissions.join(
          ', '
        )}`;
      }

      embed.addField(`${process.env.COMMAND_PREFIX}${cmd.name}`, fieldString);
    });

    msg.channel.send(embed);
  },
};