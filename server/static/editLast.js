// Show the starting view
//  nested categories items based on db

function fetchLastInsert() {
    // MAKE THE QUERY!
    return { catId: 2, subcId: 3, date: "2022-01-01" };
}

function setLastInsertAsActive() {
    const lastInsert = fetchLastInsert();
    const button = document.querySelector("#" + makeHTMLElementId("radio", lastInsert.catId, lastInsert.subcId));
    button.setAttribute("checked", "true");
    const dateSelector = document.querySelector("#dateSelector");
    dateSelector.setAttribute("value", lastInsert.date);
}

async function showCategoriesWithLastInsertAsActive() {
    await showCategories("radio", "categoryDiv");
    setLastInsertAsActive();
    setDateSelector();
}
showCategoriesWithLastInsertAsActive();

// Show the end view after submit
//  (directly from html)
//  Write on the db

// Show the starting view with last values
//  Get last values from the db


// Show the starting view after another response button
//  (directly from html)