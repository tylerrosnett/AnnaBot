require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

exports.refreshToken = function() { 
  var spotifyApi = new SpotifyWebApi();
  spotifyApi.setRefreshToken(process.env.SPOTIFY_REFRESH_TOKEN);
  spotifyApi.setClientId(process.env.SPOTIFY_CLIENT_ID);
  spotifyApi.setClientSecret(process.env.SPOTIFY_CLIENT_SECRET);

  return spotifyApi.refreshAccessToken().then(
    function (data) {

      // Save the amount of seconds until the access token expired
      var tokenExpirationEpoch = new Date().getTime() / 1000 + data.body['expires_in'];
      console.log('Token refreshed. It expires in ' +
        Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) + ' seconds!');
      var accessToken = data.body['access_token'];

      return { time: tokenExpirationEpoch, token: accessToken };
    },
    function (err) {
      console.log('Could not refresh access token', err);
    }
  );
};

// // Continually print out the time left until the token expires..
// let numberOfTimesUpdated = 0;

// setInterval(function() {
//   console.log(
//     'Time left: ' +
//       Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
//       ' seconds left!'
//   );

//   // OK, we need to refresh the token. Stop printing and refresh.
//   if (++numberOfTimesUpdated > 5) {
//     clearInterval(this);

//     // Refresh token and print the new time to expiration.
//     spotifyApi.refreshAccessToken().then(
//       function(data) {
//         tokenExpirationEpoch =
//           new Date().getTime() / 1000 + data.body['expires_in'];
//         console.log(
//           'Refreshed token. It now expires in ' +
//             Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
//             ' seconds!'
//         );
//       },
//       function(err) {
//         console.log('Could not refresh the token!', err.message);
//       }
//     );
//   }
// }, 1000);