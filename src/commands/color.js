module.exports = {
  name: 'color',
  description: 'Changes your color! Either supply a hex value, or color name.',
  example: `${process.env.COMMAND_PREFIX}color #32a852, or ${process.env.COMMAND_PREFIX}color red`,
  aliases: ['c'],
  requiredPermissions: ['Administrators'],
  async execute(msg, args) {
    //make sure the user supplied args
    if (args.length > 0) {
      //check if the supplied arg is a valid hex color 
      const hexRegex = /^#([a-f0-9]{6}|[a-f0-9]{3})$/i;
      if (args[0].match(hexRegex)) {
        const newRole = await msg.guild.roles.create(
          {
            data: {
              name: `color: ${args[0]}`,
              color: args[0],
              mentionable: false,
              hoist: false,
              position: 0,
            },
            reason: `created by color command, called by '${msg.author.username}'`,
          }
        );
        console.log(newRole);
      }
    } else {
      msg.reply('Please supply either a hex or color name.');
    }
  }
};

//gets all the color based roles from a member.
let getColorRoles = (member) => {
  const colorRoles = member.roles.cache.filter(role => role.name.includes('color:'));
  return colorRoles.map(role => role.name);
};