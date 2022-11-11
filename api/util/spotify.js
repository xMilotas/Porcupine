var SpotifyWebApi = require('spotify-web-api-node')
const rhasspy = require('./rhasspy');
const config = require('../../config')
const getResponse = require('../util/reponse_builder')

let currentVolume = 100
let laptopID

var spotifyApi = new SpotifyWebApi(config.spotifyCredentials);


// Refresh access token
async function refreshToken() {
    temp = await spotifyApi.refreshAccessToken().then(
        function (data) {
            console.log('The access token has been refreshed!');
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
        },
        function (err) {
            console.log('Could not refresh access token', err);
        }
    );
}

/** Features
 *  Change Volume
 *  Skip Songs - Next
 *  Play/pause
 *  Play specific songs
 *  Play specific playlists
 *  -- Check if user device is actually running - otherwise sucks
 */

// Called on voice commands:


// Get a User's Available Devices
async function getDevices() {
    let temp = await spotifyApi.getMyDevices().then(function (data) {
        let availableDevices = data.body.devices;
        // Hardcoded soundbar ID as a spotify connect device is not showing up in list devices call
        // Store current volume for louder/quieter interactions
        //currentVolume = device.volume_percent
        device_id = '8fb8258f527e669ae346d1ee212cd0973228e18e'
        return device_id
    }, function (err) {
        console.log('Something went wrong!', err);
    });
    return temp
}

// Skip User’s Playback To Next Track
function skipSong() {
    spotifyApi.skipToNext()
        .then(function () {
            console.log('Skip to next');
        }, function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log('Something went wrong!', err);
        });
}


// Get the User's Currently Playing Track 
async function getCurrentSongName() {
    response = spotifyApi.getMyCurrentPlayingTrack()
        .then(function (data) {
            if (data.body.item) {
                songName = data.body.item.name
                artists = data.body.item.artists
                if (artists) firstArtistName = artists[0].name
                return 'Gerade läuft "' + songName + '" von ' + firstArtistName
            }
            return "Aktuell wird kein Song abgespielt"
        }, function (err) {
            console.log('Something went wrong!', err);
        });
    return response
}

// Start/Resume a User's Playback 
async function startPlayback(options) {
    spotifyApi.play(options).then(function () {
        console.log('Playback started');
    }, function (err) {
        console.log(err)
        if (err.statusCode == 403) return
        else console.log('Something went wrong!', err);
    });
}

// Simply stops current playback
async function stopPlayback(device) {
    spotifyApi.pause({
        device_id: device
    }).then(function () {
        console.log('Playback paused');
    }, function (err) {
        console.log(err)
    });
}

// Louder
async function increaseVolume() {
    currentVolume = currentVolume + 10
    spotifyApi.setVolume(currentVolume)
        .then(function () {
            console.log('Setting volume to ' + currentVolume);
        }, function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log('Something went wrong!', err);
        });
}

// quieter
async function decreaseVolume() {
    currentVolume = currentVolume - 10
    spotifyApi.setVolume(currentVolume)
        .then(function () {
            console.log('Setting volume to ' + currentVolume);
        }, function (err) {
            //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
            console.log('Something went wrong!', err);
        });
}

/**
 * Checks if we can stream spotify songs to a device
 */
async function plausibilityCheck() {
    // Get new token
    await refreshToken()
    let laptopId = await getDevices()
    return laptopId
}

async function getPlaylistByGenre(genreName) {
    let playlist = spotifyApi.getPlaylistsForCategory(genreName, {
        limit: 10,
    }).then(function (data) {
        let i = Math.floor(Math.random() * 10)
        let uris = data.body.playlists.items.map(_ => _.uri)
        return uris[i]
    }, function (err) {
        console.log("Something went wrong!", err);
    });
    return playlist
}



// We need to run the plausibilityCheck on every call, so we might as well pipe it directly instead of calling it in every function

async function getLikedSongsAsPlaylist() {
    let songsAsPlaylist = spotifyApi.getMySavedTracks({
        limit: 50,
        offset: 0
    }).then(function (data) {
        uris = data.body.items.map(_ => _.track.uri)
        return uris
    }, function (err) {
        console.log('Something went wrong!', err);
    });
    return songsAsPlaylist
}

module.exports = {
    plausibilityCheck,
    startPlayback,
    stopPlayback,
    increaseVolume,
    decreaseVolume,
    refreshToken,
    skipSong,
    getCurrentSongName,
    getLikedSongsAsPlaylist,
    getPlaylistByGenre
}




/**
 * More Ideas
 */

// // Get Information About The User's Current Playback State
// spotifyApi.getMyCurrentPlaybackState()
//   .then(function(data) {
//     // Output items
//     if (data.body && data.body.is_playing) {
//       console.log("User is currently playing something!");
//     } else {
//       console.log("User is not playing anything, or doing so in private.");
//     }
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });

// // Get Current User's Recently Played Tracks
// spotifyApi.getMyRecentlyPlayedTracks({
//   limit : 20
// }).then(function(data) {
//     // Output items
//     console.log("Your 20 most recently played tracks are:");
//     data.body.items.forEach(item => console.log(item.track));
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });
