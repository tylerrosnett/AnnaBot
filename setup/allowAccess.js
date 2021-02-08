/* This code is used to retrive the spotify 
access token and refresh token for the account 
you want to let the bot have access to */

require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri:  process.env.CALLBACK_URI
});

var scopes = [
  'user-read-private', 
  'user-read-email', 
  'playlist-modify-private', 
  'playlist-modify-public', 
  'app-remote-control', 
  'streaming', 
  'user-top-read', 
  'user-library-modify', 
  'user-library-read', 
  'user-follow-modify',
  'user-follow-read'];

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes);

// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
console.log(authorizeURL);
