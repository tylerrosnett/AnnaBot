require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

exports.getTokens = function() {
    
  // The code that's returned as a query parameter to the redirect URI
  var code = process.env.TOKEN_GRANT_CODE;

  var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri:  process.env.CALLBACK_URI
  });

  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then(
    function (data) {
      console.log('The token expires in ' + data.body['expires_in']);
      var access_token = data.body['access_token'];
      var refresh_token = data.body['refresh_token'];
      spotifyApi.setAccessToken(data.body['access_token']);
      spotifyApi.setRefreshToken(data.body['refresh_token']);
      return {accessToken: access_token, refreshToken: refresh_token};
    },
    function (err) {
      console.log('Something went wrong!', err);
    }
  );
};
