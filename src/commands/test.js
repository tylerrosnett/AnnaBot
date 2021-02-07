require("dotenv").config();

const SpotifyWebApi = require("spotify-web-api-node");
const getVideoId = require('get-video-id'); 
var getYoutubeTitle = require('get-youtube-title')

var spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(process.env.SPOTIFY_ACCESS_TOKEN);
spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);
spotifyApi.setClientId(process.env.SPOTIFY_CLIENT_ID);
spotifyApi.setClientSecret(process.env.SPOTIFY_CLIENT_SECRET);

module.exports = {
  name: "test",
  description: "Test the spotify api ",
  aliases: ["tests"],
  requiredPermissions: [],
  execute(msg, args) {

    //TODO 
    // var video = getVideoId(args[0]);
    // console.log(video.id);
    // getYoutubeTitle(video.id, function (err, title) {
    //   console.log(title) 
    // })

    spotifyApi.refreshAccessToken().then(
      function (data) {
        console.log("The access token has been refreshed!");

        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body["access_token"]);
      },
      function (err) {
        console.log("Could not refresh access token", err);
      }
    );


    spotifyApi.searchTracks(args.join(" ")).then(
      function (data) {
        console.log("Search results: ", data.body.tracks.items[0].id);
        spotifyApi
          .addTracksToPlaylist("2g6uqL6xbKYND7cfitOcVn", [
            "spotify:track:" + data.body.tracks.items[0].id,
          ])
          .then(
            function (data) {
              msg.reply("Added that song");
            },
            function (err) {
              console.log("Something went wrong!", err);
            }
          );
      },
      function (err) {
        console.error(err);
      }
    );
  },
};
