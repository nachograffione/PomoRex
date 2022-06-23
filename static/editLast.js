// Show the starting view
//  nested categories items based on db

async function fetchLastInsert() {
    try {
        const dataParsed = await axios.get("/api/getLastInsert");
        return dataParsed.data.pomo;
    }
    catch (error) {
        console.log("Can't get categories");
    }
}

async function setLastInsertAsActive() {
    const lastInsert = await fetchLastInsert();
    const button = document.querySelector("#" + makeHTMLElementId("radio", lastInsert.idCategory, lastInsert.idSubcategory));
    button.setAttribute("checked", "true");
    const dateSelector = document.querySelector("#dateSelector");
    dateSelector.setAttribute("value", lastInsert.date);
}

async function showCategoriesWithLastInsertAsActive() {
    await showCategories("radio", "categoryDiv");
    await setLastInsertAsActive();
}
showCategoriesWithLastInsertAsActive();

// Show the end view after submit
//  (directly from html)
//  Write on the db

// Show the starting view with last values
//  Get last values from the db


// Show the starting view after another response button
//  (directly from html)