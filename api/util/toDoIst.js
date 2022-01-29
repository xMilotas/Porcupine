const http = require('wretch')
const config = require('../../config')

function addItemToList(item, projectID){
    var requestBody = {"project_id": Number(projectID),"content": item}
    http(config.addItemURL)
    .auth(`Bearer ${ config.accessToken }`)
    .json(requestBody).post()
    .timeout(() => { throw new Error('APIRequest')})
    .badRequest(() => { throw new Error('APIResponse')})
    .json()
}

async function getListItems(listID){
    // Replace placeholder with actual ID
    const json = await 
    http(config.getItemsURL.replace("{{idPlaceholder}}", listID))
    .auth(`Bearer ${ config.accessToken }`).get().json()
    return json
}

module.exports = {
    addItemToList,
    getListItems
}