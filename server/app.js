// imports
//      ejs is required in set EJS section implicitly
const path = require("path");
const express = require("express");
const { PomoRepository } = require("./pomoRepository");
// params
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

// routing
//      general
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static/")));
//      pages
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
// api
//      get
app.get("/api/categories", async (req, res, next) => {
    // params: req.query.groups

    // parse from queryString to a list of ints
    let groups = undefined;
    if (req.query.groups != undefined) {
        groups = req.query.groups.split(",").map(str => parseInt(str));
    }
    res.send({
        categories: await pomoRepository.getCategories(groups)
    });
});
app.get("/api/categories/:id", async (req, res, next) => {
    // params: req.params.id
    res.send({
        category: (await pomoRepository.getCategory(parseInt(req.params.id)))[0]
    });
});
app.get("/api/pomos", async (req, res, next) => {
    // params: req.query.categories, req.query.dateFrom, req.query.dateTo, req.query.lastAmount

    [categories, dateFrom, dateTo, lastAmount] = parseFromQueryString(req.query.categories, req.query.dateFrom, req.query.dateTo, req.query.lastAmount);

    res.send({
        pomos: await pomoRepository.getPomos(categories, dateFrom, dateTo, lastAmount)
    });
});
app.get("/api/pomos/:id", async (req, res, next) => {
    // params: req.params.id
    res.send({
        pomo: (await pomoRepository.getPomo(parseInt(req.params.id)))[0]
    });
});
app.get("/api/aggregations/pomos-quantities", async (req, res, next) => {
    // params: req.query.lastAmount, req.query.dateFrom, req.query.dateTo
    res.send({
        // to fill
    });
});
app.get("/api/aggregations/pomos-averages", async (req, res, next) => {
    // params: req.query.lastAmount, req.query.dateFrom, req.query.dateTo
    res.send({
        // to fill
    });
});
//      post
app.post("/api/categories", async (req, res, next) => {
    // params: req.body.name
});
app.post("/api/pomos", async (req, res, next) => {
    // params: req.body.datetime, req.body.catId
});
//      patch
app.patch("/api/categories/:id", async (req, res, next) => {
    // params: req.params.id, req.body.newName
});
app.patch("/api/pomos/:id", async (req, res, next) => {
    // params: req.params.id, req.body.newDatetime, req.body.newCatId
});
//      delete
app.delete("/api/categories/:id", async (req, res, next) => {
    // params: req.params.id
});
app.delete("/api/pomos/:id", async (req, res, next) => {
    // params: req.params.id
});

function parseFromQueryString(queryCategories, queryDateFrom, queryDateTo, queryLastAmount) {
    // this is only to avoid repeat code

    // parse to a list of ints
    let categories = undefined;
    if (queryCategories != undefined) {
        categories = queryCategories.split(",").map(str => parseInt(str));
    }

    // dateFrom and dateTo already work as strings

    // parse to int
    let lastAmount = undefined;
    if (queryLastAmount != undefined) {
        lastAmount = parseInt(queryLastAmount);
    }

    return [categories, queryDateFrom, queryDateTo, lastAmount];
}