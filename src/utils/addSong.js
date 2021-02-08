require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

module.exports = async (msg, tokenInfo) => {

  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(tokenInfo.token);
  spotifyApi.setClientId(process.env.SPOTIFY_CLIENT_ID);
  spotifyApi.setClientSecret(process.env.SPOTIFY_CLIENT_SECRET);

  const re = /(?:^http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)(?<youtube_id>[\w\-_]+)(?:.*))$|^(?:http(?:s?):\/\/open\.spotify\.com\/.*track(?:\/))(?<spotify_id>[a-zA-Z0-9]+)(?:.*)$/;
  const found = msg.content.match(re);

  var spotifyID;

  if (found != null) {
    const groups = found.groups;
    if(typeof groups.youtube_id !== 'undefined') {
      // just so it doesn't show up in automated searches
      var key = process.env.YOUTUBE_KEY;

      var url = 'https://youtube.googleapis.com/youtube/v3';
      try {
        url = url + '/videos?part=snippet&part=contentDetails&id=' + groups.youtube_id + '&key=' + key;
        console.log(url);
        const response = await axios.get(url);
        var title = response.data.items[0].snippet.title;
      } catch (error) {
        console.error(error);
      } 

      console.log(title);
      spotifyApi.searchTracks(title).then(
        function (data) {
          spotifyApi
            .addTracksToPlaylist('2g6uqL6xbKYND7cfitOcVn', [
              'spotify:track:' + data.body.tracks.items[0].id,
            ])
            .then(
              function () {
                msg.channel.send('song added :thumbsup:');
              },
              function (err) {
                console.log('Something went wrong!', err);
              }
            );
        },
        function (err) {
          console.error(err);
        }
      );
        
    } else {
      spotifyID = groups.spotify_id;
      spotifyApi
        .addTracksToPlaylist('2g6uqL6xbKYND7cfitOcVn', [
          'spotify:track:' +spotifyID,
        ])
        .then(
          function () {
            msg.channel.send('song added :thumbsup:');
          },
          function (err) {
            console.log('Something went wrong!', err);
          }
        );
    }
  } else {
    return false;
  }
};