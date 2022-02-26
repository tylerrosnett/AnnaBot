const fs = require('fs');
const Cataas = require('cataas-api');

module.exports = {
  name: 'catme',
  description: 'responds with a picture of a cat',
  async execute(msg) {

    let cataas = new Cataas();
    cataas.encode();

    console.log('getting cat');

    cataas.download('./cat.png')
      .then(successful => {
        if (successful) {
          console.log('Downloaded cat successfully');
          msg.channel.send({
            files: [
              './cat.png'
            ]
          });
        }
      }).catch(e => console.error(e));
  }
};