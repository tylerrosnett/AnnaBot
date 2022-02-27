const fs = require('fs');
const https = require('https');

module.exports = {
  name: 'catsays',
  description: 'Responds with a picture of a cat saying something.',
  example: [
    `${process.env.COMMAND_PREFIX}catsays Who let the dogs out?!`
  ],
  aliases: ['cs'],
  async execute(msg) {

    const encodedUrl = 'https://cataas.com/cat/says/' + encodeURIComponent(msg.content.replace('/catsay ', '').replace('/cs', ''));
    const url = new URL(encodedUrl);

    const file = fs.createWriteStream('./catsay.png');

    https.get(url, res => {
      if (res.statusCode !== 200) {
        console.log(new Error(`Request Failed.\nStatus Code: ${res.statusCode}`));
      } else {
        res.pipe(file).on('finish', () => {
          file.close();
          msg.channel.send({
            files: ['./catsay.png']
          });
        });
      }
    });

  }
};
