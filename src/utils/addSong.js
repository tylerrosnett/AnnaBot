require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

module.exports = async (msg, tokenInfo) => {

  if (msg.channel == process.env.MUSIC_CHANNEL) {
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(tokenInfo.token);
    spotifyApi.setClientId(process.env.SPOTIFY_CLIENT_ID);
    spotifyApi.setClientSecret(process.env.SPOTIFY_CLIENT_SECRET);

    const re = /(?:^http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)(?<youtube_id>[\w\-_]+)(?:.*))$|^(?:http(?:s?):\/\/open\.spotify\.com\/.*track(?:\/))(?<spotify_id>[a-zA-Z0-9]+)(?:.*)$/;
    const found = msg.content.match(re);

    var spotifyID;

    if (found != null) {
      const groups = found.groups;
      if (groups?.youtube_id) {
        var key = process.env.YOUTUBE_KEY;
        var url = 'https://youtube.googleapis.com/youtube/v3';
        try {
          url = url + '/videos?part=snippet&part=contentDetails&id=' + groups.youtube_id + '&key=' + key;
          const response = await axios.get(url);
          const regex = /^(?<name>.*?)(?:[[( ]official.*)*$/i;
          var title = response.data.items[0].snippet.title.match(regex).groups.name;
          var category = response.data.items[0].snippet.categoryId;
        } catch (error) {
          console.error(error);
        }

        if (category == '10') {
          spotifyApi.searchTracks(title).then(
            function (data) {
              if (data?.body?.tracks?.items?.[0]?.id) {
                spotifyApi
                  .addTracksToPlaylist(process.env.PLAYLIST_ID, [
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
              } else {
                msg.channel.send('Wasn\'t able to find a song on Spotify matching this name: ' + title);
              }
            },
            function (err) {
              console.error(err);
            }
          );
        } else {
          msg.channel.send('That YouTube Link isn\'t tagged as being music. Try another music link.');
        }

      } else {
        spotifyID = groups.spotify_id;
        spotifyApi
          .addTracksToPlaylist(process.env.PLAYLIST_ID, [
            'spotify:track:' + spotifyID,
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
  }
};