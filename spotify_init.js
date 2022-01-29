

// Credential Handler code, this generates a new set of auth/refresh tokens

var scopes = ['user-modify-playback-state', 'user-read-playback-state', 'playlist-read-private', 'playlist-read-collaborative', 'user-read-recently-played', 'user-top-read', 'user-read-currently-playing', 'user-library-read', 'user-library-modify']
  redirectUri = 'https://example.com/callback',
  clientId = 'b34b0d230c9744c88acc92f77cc7ab82',
  state = 'some-state-of-my-choice';

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
var spotifyApi = new SpotifyWebApi({
  redirectUri: redirectUri,
  clientId: clientId, 
  clientSecret: config.spotifyCredentials.clientSecret
});

// Create the authorization URL
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

console.log(authorizeURL);

// Auth at the URL printed from above, extract the code from the response query param and paste it below


// The code that's returned as a query parameter to the redirect URI
var code = 'AQCuU3OxJuSASefYWDhv3TKcuQCJNKvxLAcxlw6xBdU9n43bi_X_sJAF5CaXHQrUgGtZGrTzprE5kbONsVx4UC5agJ4Vy4z_BIbPldx6nwWhk7f7pXfEK2huAiaNI_Ry5tWh3QF--3Vtv8Mq9zS339PZPhGWDZvfJ54KOTb2G4CBWhKCnUJE9NThsFDECqEsTPsVjv1rgekCnsYmDwxkVIEM9hvNmQIjKajuplpQ6JvWwVJy_7Qb2iqhSwp51rX29E3V_lTdz9gpZYiJieZIXRvfGcamoZgP-1Iqa307GzTj6fXJO4Nt3cdzTDhl1E8kXmiz83A_xaIDPE_KhON4TsMHK7joWszHhOvXNaJPkPeca-_umdSBy18OPijmmSg9M-ZorraFYiJy5D6izzHGVJuwigPadbJG7hfDth6PXtZn6NpnX9-UfVP7KgZ-gTi2Y_tVhIVHGxXW';

// Retrieve an access token and a refresh token
spotifyApi.authorizationCodeGrant(code).then(
  function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);

// Take the codes and replace them in the config file