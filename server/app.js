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
    if (req.query.groups == undefined) {
        res.send({
            categories: await pomoRepository.getCategories()
        });
    }
    else {
        const groups = req.query.groups.split(",").map(str => parseInt(str));
        res.send({
            categories: await pomoRepository.getCategories(groups)
        });
    }

});
app.get("/api/categories/:id", async (req, res, next) => {
    // params: id
    res.send({
        // to fill
    });
});
app.get("/api/pomos", async (req, res, next) => {
    // params: req.query.lastAmount, req.query.dateFrom, req.query.dateTo
    res.send({
        // to fill
    });
});
app.get("/api/pomos/:id", async (req, res, next) => {
    // params: id
    res.send({
        // to fill
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
    // params: id, req.body.newName
});
app.patch("/api/pomos/:id", async (req, res, next) => {
    // params: id, req.body.newDatetime, req.body.newCatId
});
//      delete
app.delete("/api/categories/:id", async (req, res, next) => {
    // params: id
});
app.delete("/api/pomos/:id", async (req, res, next) => {
    // params: id
});