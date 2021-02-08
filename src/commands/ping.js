module.exports = {
  name: 'ping',
  description: 'responds \'Pong.\'',
  execute(msg, args) {
    console.log('Using args to make linter happy ' + args.length );
    msg.channel.send('Pong!');
  },
};