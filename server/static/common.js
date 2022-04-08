let categories = {};

async function fetchCategories() {
    try {
        const dataParsed = await axios.get("/api/categories");
        return dataParsed.data.categories;
    }
    catch (error) {
        console.log("Can't get categories");
    }
}

// Add current date as default value and as max value
// in the date selector
function setDateSelector() {
    const dateSelector = document.querySelector("#dateSelector");
    const today = new Date().toISOString().slice(0, 10);
    dateSelector.setAttribute("value", today);
    dateSelector.setAttribute("max", today);
}

// check if there is a library to do this!
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}


function addButtonListItem(buttonType, buttonName, buttonId, hasSubcategories, targetDivId) {
    // buttonType should be "radio" or "checkbox"

    // create and set an item
    const button = document.createElement("input");
    button.setAttribute("type", buttonType);
    button.setAttribute("id", buttonType + buttonId);


    if (buttonType == "radio") {
        // disable those which have subcategories
        if (hasSubcategories) {
            button.setAttribute("disabled", "true");
        }
        // link all radios
        else {
            button.setAttribute("name", "category");
        }
    }

    // create and set a label
    const label = document.createElement("label");
    label.innerHTML = buttonName;
    label.setAttribute("for", buttonType + buttonId);

    // create and set the div which contains both
    const div = document.createElement("div");
    div.setAttribute("id", "div" + buttonId);
    div.setAttribute("style", "margin-left:40px"); //temporaly
    div.appendChild(button);
    div.appendChild(label);

    // pick the div where it will be added
    const targetDiv = document.querySelector(targetDivId);
    targetDiv.appendChild(div);
}


function createHTMLOfCategoriesArray(buttonType) {
    // buttonType should be "radio" or "checkbox"

    // id system:
    //      main div: #categoryDiv
    //      categories and subcategories: <buttonType><catId><subcId> and div<catId><subcId>
    for (const category of categories) {
        if (category.subcategories.length != 0) {
            addButtonListItem(buttonType, category.name, String(category.id), true, "#categoryDiv");
            for (const subcategory of category.subcategories) {
                addButtonListItem(buttonType, subcategory.name, String(category.id) + String(subcategory.id), false, "#div" + String(category.id));
            }
        }
        else {
            addButtonListItem(buttonType, category.name, String(category.id), false, "#categoryDiv");
        }
    }
}

async function showCategories(buttonType, targetDivId) {
    // buttonType have to be "radio" or "checkbox"
    categories = await fetchCategories();
    console.log(categories);
    const categoriesHTML = createHTMLOfCategoriesArray(buttonType);

}
