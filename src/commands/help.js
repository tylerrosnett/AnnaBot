const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Reads off all the commands and what they do.',
    execute(msg, args) {
        //make an embed for the help panel
        let embed = new Discord.MessageEmbed()
            .setTitle('Command Help')
            .setDescription('');
        //go through each initialized command and add it to the embed
        msg.client.commands.forEach(cmd => {
            let fieldString = `${process.env.COMMAND_PREFIX}${cmd.name}`;
            //go through each potential property and list it if it's in
            if (cmd.description) {
                fieldString += `\n\`Description:\` ${cmd.description}`;
            }
            if (cmd.example) {
                fieldString += `\n\`Example:\` ${cmd.example}`;
            }
            if (cmd.aliases && cmd.aliases.length > 0) {
               fieldString  +=  `\n\`Aliases:\` ${cmd.aliases.join(', ')}` 
            }
            if (cmd.requiredPermissions && cmd.requiredPermissions.length > 0) {
               fieldString  +=  `\n\`Needed Permissions:\` ${cmd.requiredPermissions.join(', ')}` 
            }

            embed.addField(fieldString);
        });

        msg.channel.send(embed);
    },
}