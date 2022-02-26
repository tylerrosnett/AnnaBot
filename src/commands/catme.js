const fs = require('fs');
const Cataas = require('cataas-api');

module.exports = {
  name: 'catme',
  description: 'responds with a picture of a cat',
  async execute(msg) {

    let cataas = new Cataas();
    cataas.encode();

    console.log('getting cat');

    await cataas.get()
      .then(readable => {
        console.log('writing cat to fs');
        const stream = new fs.createWriteStream('./cat.png');
        readable.pipe(stream);
      })
      .catch(e => console.error(e));

    console.log('sending cat message');

    await msg.channel.send({
      files: [
        './cat.png'
      ]
    });
  },
};