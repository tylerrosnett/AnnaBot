module.exports = {
    name: 'ping',
    description: 'responds \'Pong.\'',
    execute(msg, args) {
        msg.channel.send('Pong!');
    },
};