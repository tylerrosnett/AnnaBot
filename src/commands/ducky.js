const fs = require('fs');
const https = require('https');

const url = new URL('https://random-d.uk/api/v2/randomimg');

module.exports = {
  name: 'ducky',
  description: 'Responds with a random ducky.',
  aliases: ['d'],
  async execute(msg) {

    const file = fs.createWriteStream('./duck.jpg');

    https.get(url, res => {

      if (res.statusCode !== 200) {
        console.log(new Error(`Request Failed.\nStatus Code: ${res.statusCode}`));
      } else {

        res.pipe(file).on('finish', () => {
          file.close();
          msg.reply({
            files: ['./duck.jpg']
          });
        });

      }
    });
  }
};
