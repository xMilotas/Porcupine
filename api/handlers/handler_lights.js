const lightsHandler = require('../util/lightsHandler');

module.exports = function (action, slots) {
    const location = slots.location
    const status = (slots.state == "an") ? 1 : 0;
    console.log(location, status)
    if(!location && status != undefined) return "Ich habe leider nicht verstanden wo ich das Licht "+slots.state+" machen soll"
    // Available values: (wohnzimmer | schlafzimmer | laptop | stehlampe | kugellampe) 
    switch (location) {
        case "stehlampe":
            lightsHandler.lightsHandler("Stehlampe", status)
            break;
        case "laptop":
            lightsHandler.lightsHandler("Schreibtischlampe", status)
            break;
        case "kugellampe":
            lightsHandler.lightsHandler("Kugellampe", status)
            break;
        case "schlafzimmer":
            lightsHandler.lightsHandler("Nachttischlampe", status)
            break;
        case "wohnzimmer":
            lightsHandler.lightsHandler("Stehlampe",status);
            setTimeout(() => {
                lightsHandler.lightsHandler("Kugellampe",status);
            }, 2000);
            break;
        case "überall":
            lightsHandler.lightsHandler("All",status);
            break;
    }
    return ""
}