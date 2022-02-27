const axios = require('axios');

module.exports = {
  name: 'quote',
  description: 'Responds with a random quote',
  aliases: ['q'],
  async execute(msg) {

    axios.get('https://zenquotes.io/api/random')
      .then(res => {
        let txt = `"${res.data[0].q}" - ${res.data[0].a}`;
        msg.channel.send(txt);
      });
  }
};
