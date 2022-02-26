const fs = require('fs');
const Cataas = require('cataas-api');

module.exports = {
  name: 'catme',
  description: 'responds with a picture of a cat',
  async execute(msg) {

    let cataas = new Cataas();
    cataas.encode();

    console.log('getting cat');

    cataas.get()
      .then(readable => {

        console.log('writing cat to fs');
        const stream = new fs.createWriteStream('./cat.png');
        readable.pipe(stream);

        console.log('sending cat message');

        msg.channel.send({
          files: [
            './cat.png'
          ]
        }).catch(e => console.error(e));
      }).catch(e => console.error(e));
  },
};