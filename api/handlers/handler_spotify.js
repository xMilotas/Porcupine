const spotify = require('../util/spotify');

let myPlaylistsMap = new Map([
    ["Gute Laune Musik","spotify:playlist:37i9dQZF1DXdPec7aLTmlC"],
    ["Chillout Lounge","spotify:playlist:37i9dQZF1DWTvNyxOwkztu"],
    ["Happy Dance","spotify:playlist:37i9dQZF1DX4uPi2roRUwU"],
    ["Techno Bunker","spotify:playlist:37i9dQZF1DX6J5NfMJS675"],
    ["Tropical House","spotify:playlist:37i9dQZF1DX0AMssoUKCz7"],
    ["Release Radar","spotify:playlist:37i9dQZEVXbfPzjdqbvBpU"],
    ["Zuhause","spotify:playlist:37i9dQZF1DX1htCFhfVtyK"],
    ["Summer House","spotify:playlist:37i9dQZF1DX05r4Oy3Ln97?si=2b92027ccad84d2b"],
    ["Mix der Woche","spotify:playlist:37i9dQZEVXcUPj8WJb5IBL"]
])

async function _startPlayback(id, name){
    let playback = "spotify:playlist:37i9dQZF1DX1htCFhfVtyK"
    let playbackOptions = {device_id: id}
    let isPlaylist = true
    if(name == "Lieblingssongs"){
        playback = await spotify.getLikedSongsAsPlaylist()
        isPlaylist = false
    } else if (name == "Gute Laune Musik"){
        playback = await spotify.getPlaylistByGenre('party')
    } else playback = myPlaylistsMap.get(name) 
    if (isPlaylist) playbackOptions.context_uri = playback
    else playbackOptions.uris = playback
    spotify.startPlayback(playbackOptions)
}

// React on whatever intent is called
module.exports = async function (action, slots) {
    console.log("Retrieved slots+action @spotify: ")
    console.log(action, slots)
    response = ""
    // Extract the name if we have one
    if (slots) var name = slots.artistName || undefined
    // Refresh token and check if we have a device we can stream to
    let deviceID = await spotify.plausibilityCheck()
    // React on action
    if(deviceID){
        switch (action) {
            case "StartPlayback":
                _startPlayback(deviceID, name)
                break;
            case "PlayPlaylist":
                _startPlayback(deviceID, name)
                break;
            case "StopPlayback":
                spotify.stopPlayback(deviceID)
                break;
            case "ChangeVolumeDown":
                spotify.decreaseVolume()
                break;
            case "ChangeVolumeUp":
                spotify.increaseVolume()
                break;
            case "GetCurrentSong":
                response = spotify.getCurrentSongName()
                break;
            case "SkipSong":
                spotify.skipSong()
                break;
        }
    }
    return response
}