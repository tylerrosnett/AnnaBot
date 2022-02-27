const fs = require('fs');
const https = require('https');

const url = new URL('https://cataas.com/cat');

module.exports = {
  name: 'catme',
  description: 'Responds with a random cat picture.',
  aliases: ['cm'],
  async execute(msg) {

    const file = fs.createWriteStream('./cat.png');

    https.get(url, res => {

      if (res.statusCode !== 200) {
        console.log(new Error(`Request Failed.\nStatus Code: ${res.statusCode}`));
      } else {

        res.pipe(file).on('finish', () => {
          file.close();
          msg.reply({
            files: ['./cat.png']
          });
        });

      }
    });
  }
};
