let categories = [];

async function fetchCategories() {
    try {
        const dataParsed = await axios.get("/api/getCategories");
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

function makeCatAndSubcId(catId, subcId = undefined) {
    // format: <catId>[-<subcId>]
    if (subcId == undefined) {
        return catId;
    }
    else {
        return catId + "-" + subcId;
    }
}

function getFromCatAndSubcId(id) {
    // format: <catId>[-<subcId>]
    let [catId, subcId] = id.split("-");    // subcId will be undefined if there's no subc
    return { catId, subcId };
}

function makeHTMLElementId(element, catId, subcId = undefined) {
    // format: <HTMLElement>_<catAndSubcId>
    return element + "_" + makeCatAndSubcId(catId, subcId);
}

function getFromHTMLElementId(id) {
    // format: <HTMLElement>_<catAndSubcId>
    let [element, catAndSubcId] = id.split("_");
    return { element: element, ...getFromCatAndSubcId(catAndSubcId) };
}

function createLabel(labelText, buttonId) {
    // create and set a label
    const label = document.createElement("label");
    label.innerHTML = labelText;
    label.setAttribute("for", buttonId);
    return label;
}

function createButton(buttonType, catAndSubcId, isCatWithSubc) {
    // buttonType has to be "radio" or "checkbox"
    // buttonType defines:
    //      the button type (obviously)
    //      the name attr (radio: the same for every button to link them / check: the catAndSubcId to distinguish each button)
    //      the value attr (radio: the catAndSubcId / check: it's unnecessary, it will be "on" for the active ones)
    //      the disabled attr (radio: disable button only if it's a category with subcategories, check: don't disable anyone)
    const buttonId = makeHTMLElementId(buttonType, catAndSubcId);
    const button = document.createElement("input");
    button.setAttribute("id", buttonId);

    // settings that depend on buttonType
    button.setAttribute("type", buttonType);
    switch (buttonType) {
        case "radio":
            button.setAttribute("name", "catAndSubc");
            button.setAttribute("value", catAndSubcId);
            if (isCatWithSubc) {
                button.setAttribute("disabled", "true");
            }
            break;
        case "checkbox":
            button.setAttribute("name", catAndSubcId);
            break;
        default:
            break;
    }
    return button;
}

function createBlockItem(buttonType, labelText, catId, subcId, isCatWithSubc) {
    // buttonType has to be "radio" or "checkbox"

    // create and set the div which contains the button and label
    const div = document.createElement("div");

    if (subcId != undefined) {
        div.setAttribute("style", "margin-left:40px"); //temporaly
    }

    // create and append button
    div.appendChild(createButton(buttonType, makeCatAndSubcId(catId, subcId), isCatWithSubc));

    // create and append label
    div.appendChild(createLabel(labelText, makeHTMLElementId(buttonType, catId, subcId)));
    return div;
}

function createHTMLOfBlock(buttonType, category) {
    // Block refers to the list section that includes a category and its subcategories
    // buttonType has to be "radio" or "checkbox"
    // category is an object literal

    // create the block div
    const div = document.createElement("div");
    // append the category button
    div.appendChild(createBlockItem(buttonType, category.name, category.id, undefined, (category.subcategories.length != 0)));
    // append the subcategory buttons
    for (const subcategory of category.subcategories) {
        div.appendChild(createBlockItem(buttonType, subcategory.name, category.id, subcategory.id, false));
    }
    return div;
}

async function showCategories(buttonType, targetDivId) {
    // buttonType has to be "radio" or "checkbox"
    categories = await fetchCategories();
    const targetDiv = document.querySelector("#" + targetDivId);
    for (const category of categories) {
        targetDiv.appendChild(createHTMLOfBlock(buttonType, category));
    }
}
