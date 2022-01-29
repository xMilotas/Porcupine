const config = require('../../config')
const http = require('wretch')

function lightsHandler(input, status){
	var jsonDataObj = { 
		outletID: config.lightsMap[input],
		outletStatus: status,
		timer: 'false'
	};

	http('http://192.168.0.63:8080/api/PowerPlugs').post(jsonDataObj);
}

module.exports = {
    lightsHandler: lightsHandler
}
