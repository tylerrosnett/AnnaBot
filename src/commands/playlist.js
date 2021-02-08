require('dotenv').config();

module.exports = {
  name: 'playlist',
  description: 'Links the playlist that songs are added to.',
  execute(msg, args) {
    console.log('Using args to make linter happy ' + args.length );
    msg.channel.send('https://open.spotify.com/playlist/' + process.env.PLAYLIST_ID);
  }
};