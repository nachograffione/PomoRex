//Show the starting view
//nested categories items based on db

showCategories("checkbox", "#categoryDiv");

setDateSelector();

//Manage checkbox selection

function toggleSubcategories(evt) {
    const buttonState = evt.target.checked;
    let buttonId = evt.target.getAttribute("id");
    buttonId = buttonId.slice(-1);
    buttonId = parseInt(buttonId);

    const subcategories = categories[buttonId].slice(1);
    for (let j = 0; j < subcategories.length; j++) {
        const subcatButton = document.querySelector("#checkbox" + String(buttonId) + "-" + String(j));
        subcatButton.checked = buttonState;
    }
}

function manageCheckboxSelection() {
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        if (Array.isArray(category)) {  //if the category has subcategories
            const button = document.querySelector("#checkbox" + String(i));
            button.addEventListener("input", toggleSubcategories);
        }
    }
}

manageCheckboxSelection();

//Calculate 10 worker days before average


//Update average chart


//Update 10 worker days before chart


//Update last inputs list


//Update month chart


//Update charts after a user selection