// Show the starting view
//  nested categories items based on db

showCategories("checkbox", "categoryDiv");

setDateSelector();

// Manage checkbox selection

function checkboxSelectionHandler(evt) {
    // It toggles the subcategories of the category that was toggled
    const buttonState = evt.target.checked;
    const toggledCatId = getFromHTMLElementId(evt.target.getAttribute("id")).catId;
    for (const checkbox of document.querySelectorAll("input[type=checkbox]")) {
        if (getFromHTMLElementId(checkbox.getAttribute("id")).catId == toggledCatId) {
            checkbox.checked = buttonState;
        }
    }
}

async function addListenersToSubcatButtons() {
    categories = await fetchCategories();
    for (const category of categories) {
        if (category.subcategories.length != 0) {
            const button = document.querySelector("#" + makeHTMLElementId("checkbox", category.id, undefined));
            button.addEventListener("input", checkboxSelectionHandler);
        }
    }
}

addListenersToSubcatButtons();

// Calculate 10 worker days before average


// Update average chart


// Update 10 worker days before chart


// Update last inputs list


// Update month chart
function getActiveCategories() {
    return {
        categories: [
            {
                id: 3,
                name: "Ingenería",
                subcategories: [
                    {
                        id: 5,
                        name: "Clases",
                    }
                ]
            },
            {
                id: 4,
                name: "Otros",
                subcategories: []
            }
        ]
    };
}
async function fetchMonth(month, year) {
    const dataParsed = await axios.get("/api/getMonth", { params: { month: month, year: year, categories: getActiveCategories() } });
    console.log("pomos ", dataParsed.data);
    return dataParsed.data;
}

fetchMonth(4, 2022);

// Update charts after a user selection