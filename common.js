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


function addButtonListItem(buttonType, buttonName, buttonId, hasSubcategories, targetDivId) {
    //buttonType should be "radio" or "checkbox"

    //create and set an item
    const button = document.createElement("input");
    button.setAttribute("type", buttonType);
    button.setAttribute("id", buttonType + buttonId);


    if (buttonType == "radio") {
        //disable those which have subcategories
        if (hasSubcategories) {
            button.setAttribute("disabled", "true");
        }
        //link all radios
        else {
            button.setAttribute("name", "category");
        }
    }

    //create and set a label
    const label = document.createElement("label");
    label.innerHTML = buttonName;
    label.setAttribute("for", buttonType + buttonId);

    //create and set the div which contains both
    const div = document.createElement("div");
    div.setAttribute("id", "div" + buttonId);
    div.setAttribute("style", "margin-left:40px"); //temporaly
    div.appendChild(button);
    div.appendChild(label);

    //pick the div where it will be added
    const targetDiv = document.querySelector(targetDivId);
    targetDiv.appendChild(div);
}


function createHTMLOfCategoriesArray(buttonType) {
    //buttonType should be "radio" or "checkbox"

    //id system:
    //main div: #categoryDiv
    //categories and subcategories: buttonTypeNM and divNM
    //  (N and M are indexes, i and j in the code)
    for (let i = 0; i < categories.length; i++) {   //for each category
        const category = categories[i];
        if (Array.isArray(category)) {  //if it has subcategories
            addButtonListItem(buttonType, category[0], String(i), true, "#categoryDiv");

            const subcategories = category.slice(1);    //store subcategories
            for (let j = 0; j < subcategories.length; j++) {    //for each subcategory
                const subcategory = subcategories[j];
                addButtonListItem(buttonType, subcategory, String(i) + "-" + String(j), false, "#div" + String(i));
            }
        }
        else {
            addButtonListItem(buttonType, category, String(i), false, "#categoryDiv");
        }
    }
}

function showCategories(buttonType, targetDivId) {
    //buttonType have to be "radio" or "checkbox"

    const categoriesHTML = createHTMLOfCategoriesArray(buttonType);

}
