const { Collection } = require('discord.js');
const toHex = require('colornames');
const colorMessages = require('../utils/colorMessages');

module.exports = {
  name: 'color',
  description: 'Changes your color! Either supply a color hex, color name, or user\'s name whos color you want.',
  example: [
    `${process.env.COMMAND_PREFIX}color #32a852`,
    `${process.env.COMMAND_PREFIX}color red`,
    `${process.env.COMMAND_PREFIX}color Anna`
  ],
  aliases: ['c'],
  requiredPermissions: [],
  async execute(msg, args) {
    // make sure the user supplied an argument
    if (args.length !== 1) {
      msg.channel.send(
        "please supply either a color name/hex, or a person's name if you want their color."
      );
      return;
    }
    const arg = args[0].toLowerCase();
    const hexRegex = /^#([a-f0-9]{6}|[a-f0-9]{3})$/i;

    // check if the supplied arg is a valid hex color
    if (arg.match(hexRegex)) {
      // if it is, apply
      try {
        await moveColorRole(msg, arg);
        const response = colorMessages.getStdMessage();
        msg.channel.send(`🪄 🎨 ${response}`);
      } catch (err) {
        console.error(err);
        msg.channel.send('sorry, something went wrong.');
      }
      
    // clear color role if arg is 'clear'
    } else if (arg === 'clear') {
      const roles = await updatedColorRoles(msg.guild);
      const colorRole = getColorRole(msg.member, roles);
      if (colorRole) {
        leaveOrDeleteRole(msg, roles);
      }
    // once we've checked for either a color hex or clear command, check for color names, or usernames.
    } else {
      const colorFromName = toHex(arg);
      // if it's a valid color name, apply it
      if (colorFromName) {
        try {
          await moveColorRole(msg, colorFromName.toLowerCase());
          // get a response and send it once the move is complete
          const response = colorMessages.getStdMessage();
          msg.channel.send(`🪄 🎨 ${response}`);
        } catch (err) {
          console.error(err);
          msg.channel.send('sorry, something went wrong.');
        }
      } else {
        // finally, check for user mentions or written usernames
        let targetUser = undefined;

        // first check for mentions
        const mentionedUser = msg.mentions.users.first();
        if (mentionedUser) {
          targetUser = await msg.guild.members.fetch(mentionedUser.id);

        // if nobody was mentioned, see if the argument is a writen name
        } else {
          const members = await msg.guild.members.fetch();
          targetUser = members.find((member) => {
            return (
              member.nickname?.toLowerCase() === arg.toLowerCase() ||
              member.user.username.toLowerCase() === arg.toLowerCase()
            );
          });
        }
        // if there was a mention or the search found a user, get their color role and apply
        if (targetUser) {
          const colorRoles = targetUser.roles.cache.filter((role) =>
            role.name.includes('color:')
          );
          if (colorRoles.size > 0) {
            // targetUser has a color role, let's steal it
            try {
              await moveColorRole(msg, colorRoles.first().hexColor);
              // get a response and send it once the move is complete
              const response = colorMessages.getUsrMessage();
              msg.channel.send(`🪄 🎨 ${response}`);
            } catch (err) {
              console.error(err);
              msg.channel.send('sorry, something went wrong.');
            }
          } else {
            msg.reply("This user doesn't have a color role...?");
          }
        } else {
          // if the user input didn't match a color hex, color name, or user, we let them know
          msg.channel.send('Your input didn\'t match a color hex, color name, or user name.');
        }
      }
    }
  }
};


// moves the target user to a new color role.
const moveColorRole = async (msg, color) => {
  const roles = await updatedColorRoles(msg.guild);
  // check if they currently have a color role, they're the only member in it, and the target color role doesn't exist.
  // In that case, we can simply edit the current role.
  const colorRole = getColorRole(msg.member, roles);
  if (colorRole) {
    // if the user is trying to change to the color they're already in, do nothing
    if (colorRole.hexColor === color.toLowerCase()) {
      return;
    }
    if (colorRole.members.size === 1 && ! await colorRoleExists(msg.guild, color)) {
      // edit the role's color and name
      colorRole.edit({
        name: `color: ${color}`,
        color: color,
      });
      return;
    }
    // if the user is in a color role and the target color role exists, we leave/delete the current one and merge them in
    leaveOrDeleteRole(msg, roles);
  }
  // finally join/create the target color role
  joinOrCreateRole(msg, color, roles);
};


// leaves or deletes the supplied user's current color role.
const leaveOrDeleteRole = (msg, roles) => {
  // get user's color role
  const colorRole = getColorRole(msg.member, roles);
  // if there's members in the old role, leave
  if (colorRole) {
    if (colorRole.members.size > 1) {
      msg.member.roles.remove(colorRole);
    } else {
      // otherwise delete the old role
      colorRole.delete(`removed by color command, called by ${msg.author.username}`)
    }
  }
};


// joins or creates the target color role
const joinOrCreateRole = async (msg, color) => {
  // check if the target color role already exists
  const targetColorRole = await colorRoleExists(msg.guild, color);
  if (targetColorRole) {
    console.log(`color role ${color} already exists, adding ${msg.author.username} to it`);
    // if it does, join it
    msg.member.roles.add(targetColorRole);
  } else {
    // before creating a color role, we get the bot's highest role so we can position the color roles as high as possible
    const botMember = await msg.guild.members.fetch(msg.client.user);
    const roleID = botMember.roles.highest.id;
    const rolePosition = msg.guild.me.roles.highest.position;

    //try catch block for now, as once in a blue moon this throws a missing permissions error. extremely hard to reproduce.
    try {
      const newRole = await msg.guild.roles
        .create({
          data: {
            name: `color: ${color}`,
            color: color,
            mentionable: false,
            hoist: false,
            position: rolePosition,
          },
          reason: `created by color command, called by '${msg.author.username}'`
        });
      // apply the created role
      if (newRole) {
        console.log(`created color role '${newRole.name}'`);
        msg.member.roles.add(
          newRole,
          `joined by color command, called by '${msg.author.username}'`
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
};


// returns a color role if it already exists
const colorRoleExists = async (guild, color) => {
  // go through the guild's roles to see if the color role exists
  const roles = await guild.roles.fetch();
  const filtered = roles.cache.filter((role) =>
    role.name.includes(color)
  );
  // return it if there's a match
  return filtered.size > 0 ? filtered.first() : undefined;
};


// gets the color role for a member
const getColorRole = (target, roles) => {
  // go through all the color roles
  const colorRoles = roles.filter((role) => {
    // see if any of the members are the target
    return role.members.has(target.id);
  });
  return colorRoles.size > 0 ? colorRoles.first() : undefined;
};


// get updated role member counts. discordjs seems to have problems with caching role changes, so we get fresh numbers before taking action
const updatedColorRoles = async (guild) => {
  // fetch the members of the server
  const members = await guild.members.fetch({
    cache: true,
    force: false,
  });
  // go through each member's roles, and create a new list
  const updatedRoles = new Collection();
  members.each((member) => {
    member.roles.cache.each((role) => {
      if (!updatedRoles.has(role.id) && role.name.includes('color:')) {
        updatedRoles.set(role.id, role);
      }
    });
  });

  return updatedRoles;
};
