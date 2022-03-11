//Add current date as default value and as max value
//in the date selector
function setDateSelector() {
    const dateSelector = document.querySelector("#dateSelector");
    const today = new Date().toISOString().slice(0, 10);
    dateSelector.setAttribute("value", today);
    dateSelector.setAttribute("max", today);
}

//check if there is a library to do this!
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}


function createHTMLOfCategoryButton(buttonType, buttonName, buttonId) {
    //create and set an item
    const button = document.createElement("input");
    button.setAttribute("type", buttonType);
    button.setAttribute("id", buttonId);

    //create and set a label
    const label = document.createElement("label");
    label.innerHTML = buttonName;
    label.setAttribute("for", buttonId);

    //create and set the div which contains both
    const div = document.createElement("div");
    div.setAttribute("id", "div" + buttonId);
    div.appendChild(button);
    div.appendChild(label);

    return div;
}

function createHTMLOfCategoriesArray(buttonType, array, firstButtonId) {
    //create the array div
    const arrayDiv = document.createElement("div");
    arrayDiv.setAttribute("style", "margin-left:40px"); //temporaly
    //for each item
    for (let i = 0; i < array.length; i++) {
        const item = array[i];

        const itemId = String(firstButtonId) + "." + String(i);
        let itemDiv;
        //if it's an array
        if (Array.isArray(item)) {
            //create a item div
            itemDiv = document.createElement("div");
            //add the first element to the item div
            const button = createHTMLOfCategoryButton(buttonType, item[0], itemId);
            itemDiv.appendChild(button);

            //add childArray to the item div
            const childArrayDiv = createHTMLOfCategoriesArray(buttonType, item.slice(1), itemId); //childArray = recursive call with slice
            itemDiv.appendChild(childArrayDiv);
        }
        else {
            itemDiv = createHTMLOfCategoryButton(buttonType, array[i], itemId);
        }
        //add the item div into the main div
        arrayDiv.appendChild(itemDiv);
    }
    return arrayDiv;
}

function showCategories(buttonType, targetDivId) {
    //buttonType have to be "radio" or "checkbox"

    const categoriesHTML = createHTMLOfCategoriesArray(buttonType, categories, 0);

    console.log(categoriesHTML);
    //pick the div where it will be added
    const targetDiv = document.querySelector(targetDivId);
    targetDiv.appendChild(categoriesHTML);
}
