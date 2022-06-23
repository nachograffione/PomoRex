// IMPORTS ---------------------------------------------------------------------

// ejs is required in set EJS section implicitly
const path = require("path");
const express = require("express");
const { PomoRepository } = require("./pomoRepository");




// GLOBAL CONSTANTS, SET UP ----------------------------------------------------

const port = 3000;

// instantiate PomoRepository
const pomoRepository = new PomoRepository();

// start server
const app = express();
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// set EJS
app.set("view engine", "ejs");  //it will do require("ejs");
app.set("views", path.join(__dirname, "views"));




// ROUTING ---------------------------------------------------------------------

// -- General --
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static/")));

// -- Pages --
app.get("/insert", (req, res, next) => {
    res.render("insertOrEditLast.ejs", { editLast: false });
});
app.get("/submitted", (req, res, next) => {
    res.render("submitted.ejs");
});
app.get("/editLast", (req, res, next) => {
    res.render("insertOrEditLast.ejs", { editLast: true });
});
app.get("/control", (req, res, next) => {
    res.render("control.ejs");
});

// -- Api --

//      -- Routes for "GET" --

//          -- Categories --
app.get("/api/categories", async (req, res, next) => {
    // params: req.query.groups

    const groups = parseIdArrayFromQueryString(req.query.groups);

    res.send({
        categories: await pomoRepository.getCategories(groups)
    });
});
app.get("/api/categories/:id", async (req, res, next) => {
    // params: req.params.id
    res.send({
        category: await pomoRepository.getCategory(parseInt(req.params.id))
    });
});

//          -- Groups --
app.get("/api/groups", async (req, res, next) => {
    // no params
    res.send({
        groups: await pomoRepository.getGroups()
    });
});
app.get("/api/groups/:id", async (req, res, next) => {
    // params: req.params.id
    res.send({
        group: await pomoRepository.getGroup(parseInt(req.params.id))
    });
});

//          -- Pomos --
app.get("/api/pomos", async (req, res, next) => {
    // params: req.query.categories, req.query.dateFrom, req.query.dateTo, req.query.lastAmount

    const categories = parseIdArrayFromQueryString(req.query.categories);

    // dateFrom and dateTo already work as strings

    // parse to int
    let lastAmount = undefined;
    if (req.query.lastAmount != undefined) {
        lastAmount = parseInt(req.query.lastAmount);
    }

    res.send({
        pomos: await pomoRepository.getPomos(categories, req.query.dateFrom, req.query.dateTo, lastAmount)
    });
});
app.get("/api/pomos/:id", async (req, res, next) => {
    // params: req.params.id
    res.send({
        pomo: await pomoRepository.getPomo(parseInt(req.params.id))
    });
});

//          -- Aggregations --
app.get("/api/aggregations/pomos-quantities", async (req, res, next) => {
    // params: req.query.categories, req.query.dateFrom, req.query.dateTo

    const categories = parseIdArrayFromQueryString(req.query.categories);

    // dateFrom and dateTo already work as strings

    res.send({
        pomosQuantities: await pomoRepository.getPomosQuantities(categories, req.query.dateFrom, req.query.dateTo)
    });
});
app.get("/api/aggregations/pomos-averages", async (req, res, next) => {
    // params: req.query.categories, req.query.dateFrom, req.query.dateTo

    const categories = parseIdArrayFromQueryString(req.query.categories);

    // dateFrom and dateTo already work as strings

    res.send({
        pomosAverages: await pomoRepository.getPomosAverages(categories, req.query.dateFrom, req.query.dateTo)
    });
});

//      -- Routes for "POST" --
app.post("/api/categories", async (req, res, next) => {
    // params: req.body.name
    res.send({
        insertedCategory: await pomoRepository.insertCategory(req.body.name)
    });
});
app.post("/api/groups", async (req, res, next) => {
    // params: req.body.name, req.body.categories
    const categories = parseIdArrayFromQueryString(req.body.categories);
    res.send({
        insertedGroup: await pomoRepository.insertGroup(req.body.name, categories)
    });
});
app.post("/api/pomos", async (req, res, next) => {
    // params: req.body.datetime, req.body.catId
    res.send({
        insertedPomo: await pomoRepository.insertPomo(req.body.datetime, req.body.catId)
    });
});

//      -- Routes for "PATCH" --
app.patch("/api/categories/:id", async (req, res, next) => {
    // params: req.params.id, req.body.newName
    res.send({
        updatedCategory: await pomoRepository.updateCategory(parseInt(req.params.id), req.body.newName)
    });
});
app.patch("/api/groups/:id", async (req, res, next) => {
    // params: req.params.id, req.body.newName, req.body.newCategories
    const newCategories = parseIdArrayFromQueryString(req.body.newCategories);
    res.send({
        updatedGroup: await pomoRepository.updateGroup(parseInt(req.params.id), req.body.newName, newCategories)
    });
});
app.patch("/api/pomos/:id", async (req, res, next) => {
    // params: req.params.id, req.body.newDatetime, req.body.newCatId
    res.send({
        updatedPomo: await pomoRepository.updatePomo(parseInt(req.params.id), req.body.newDatetime, req.body.newCatId)
    });
});

//      -- Routes for "DELETE" --
app.delete("/api/categories/:id", async (req, res, next) => {
    // params: req.params.id
    res.send({
        deletedCategory: await pomoRepository.deleteCategory(parseInt(req.params.id))
    });
});
app.delete("/api/groups/:id", async (req, res, next) => {
    // params: req.params.id
    res.send({
        deletedGroup: await pomoRepository.deleteGroup(parseInt(req.params.id))
    });
});
app.delete("/api/pomos/:id", async (req, res, next) => {
    // params: req.params.id
    res.send({
        deletedPomo: await pomoRepository.deletePomo(parseInt(req.params.id))
    });
});




// AUX METHODS -----------------------------------------------------------------

function parseIdArrayFromQueryString(queryArray) {
    // useful for either groups and categories

    // parse to a list of ints
    let idArray = undefined;
    if (queryArray != undefined) {
        idArray = queryArray.split(",").map(str => parseInt(str));
    }
    return idArray;
}