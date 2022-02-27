module.exports = (msg, tokenInfo) => {

  //get the command and arguments the user wrote
  const args = msg.content
    .slice(process.env.COMMAND_PREFIX.length)
    .trim()
    .split(' ');
  //get the command from the args
  const commandName = args.shift().toLowerCase();

  let targetCommand;
  //check if the command exists
  if (msg.client.commands.has(commandName)) {
    targetCommand = commandName;
  } else {
    //if we can't initally find it, check command aliases
    const aliasMatch = msg.client.commands.find((cmd) => {
      if (cmd.aliases && cmd.aliases.length > 0) {
        return cmd.aliases.filter((alias) => alias === commandName).length > 0;
      } else {
        return false;
      }
    });
    //if a matching alias is found, make it the command we're executing
    if (aliasMatch) {
      targetCommand = aliasMatch.name;
    }
  }

  if (!targetCommand) {
    console.log('Command not found. type \'/help\' to see a list of commands.');
  } else {
    const command = msg.client.commands.get(targetCommand);

    //check if the user is allowed to run the command.
    let canRun = false;
    //if the requiredPermissions field doesn't exist or is empty, anyone can run the command
    if (command.requiredPermissions && command.requiredPermissions.length > 0) {
      //get the user's roles
      const roles = msg.member.roles.cache.map(role => role.name);
      //compare the user's roles to the requiredPermissions field
      command.requiredPermissions.forEach(roleName => {
        if (roles.find(role => role === roleName)) {
          canRun = true;
        }
      });
    } else {
      canRun = true;
    }

    //if the user is allowed, run the command
    if (canRun === true) {
      try {
        command.execute(msg, args, tokenInfo);
      } catch (err) {
        console.error(err);
        msg.reply('There was an error when running that command.');
      }
    } else {
      msg.reply('You don\'t have permisson to run this, sorry.');
    }
  }
};