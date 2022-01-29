const toDoIst = require('../util/toDoIst')
const config = require('../../config')
const getResponse = require('../util/reponse_builder')

function addItem(item, id, listType){
    // Uppercase item
    item = item[0].toUpperCase()+item.slice(1);   
    toDoIst.addItemToList(item,id)
    if (listType == "einkaufsliste") return getResponse("shoppingList", "addItem", item)
    else return getResponse("shoppingList", "addItem", [item, "DM"])
}

async function getItems(id){
    items = await toDoIst.getListItems(id)
    if (items.length > 0){
        console.log(items)
        itemString = ""
        for (let index = 0; index < items.length; index++) {
            if (index == items.length -1) itemString = itemString + "und " + items[index].content
            else itemString = itemString + items[index].content + ", "
        }
        output = getResponse("shoppingList", "getContents", itemString)
    } else {
        output = getResponse("shoppingList", "getContentsEmpty")
    }
    return output
}

// React on whatever intent is called
module.exports = async function (action, slots) {
    console.log("Retrieved slots+action @shoppingList: ")
    console.log(action, slots)
    response = ""
    // Extract slots
    if(slots){
        let item = slots.item
        let list = slots.listType
        console.log(item, list)
        // Configure ID
        let id = (list == "drogerieliste" || list == "dm" || list == "drogerie") ? config.dmListID : config.standardListID; 
        // React on action
        switch (action) {
            case "AddToList":
                response = addItem(item, id, list)
                break;
            case "GetContents":
                response = await getItems(id)
                break;
        }
    } else response = getResponse("shoppingList", "error")
    return response
}