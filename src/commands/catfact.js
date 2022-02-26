const axios = require('axios');

module.exports = {
  name: 'catfact',
  description: 'responds with a cat fact',
  async execute(msg, args) {
    console.log('Using args to make linter happy ' + args.length);
    const response = await axios.get('https://meowfacts.herokuapp.com/');
    msg.channel.send(response.data.data[0]);
  },
};