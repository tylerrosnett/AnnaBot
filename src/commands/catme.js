const fs = require('fs');
const Cataas = require('cataas-api');

module.exports = {
  name: 'catme',
  description: 'responds with a picture of a cat',
  async execute(msg) {

    let cataas = new Cataas();

    cataas.encode();
    cataas.get()
      .then(readable => {
        const stream = new fs.createWriteStream('cat.png');
        readable.pipe(stream);
      })
      .catch(e => console.error(e));

    await msg.channel.send({
      files: [
        './cat.png'
      ]
    });
    fs.rmSync('./cat.png');
  },
};