// imports
//      ejs is required in set EJS section implicitly
const path = require("path");
const express = require("express");
const pomoRepository = require("./pomoRepository");
// params
const port = 3000;

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
//      api
app.get("/api/getCategories", async (req, res, next) => {
    res.send({
        categories: await pomoRepository.getCategories()
    });
});
app.get("/api/getLastInsert", async (req, res, next) => {
    res.send({
        pomo: await pomoRepository.getLastInsert()
    });
});
app.get("/api/getMonth", async (req, res, next) => {
    const firstDay = new Date(req.query.year, req.query.month - 1, 1); //month-1 because it needs monthIndex (from 0 to 11)
    const lastDay = new Date(req.query.year, req.query.month, 0);
    const categories = JSON.parse(req.query.categories).categories;
    let pomos = [];
    for (const category of categories) {
        if (category.subcategories.length != 0) {
            for (const subcategory of category.subcategories) {
                pomos.push({
                    category: category,
                    subcategory: subcategory,
                    pomos: await pomoRepository.getPomosQty(firstDay, lastDay, category.id, subcategory.id)
                });
            }
        }
        else {
            pomos.push({
                category: category,
                pomos: await pomoRepository.getPomosQty(firstDay, lastDay, category.id)
            });
        }
    }
    res.send(pomos);
});
app.post("/api/insertPomo", async (req, res, next) => {
    const [catId, subcId] = req.body.catAndSubc.split("-");
    pomoRepository.insertPomo(catId, subcId, req.body.date); //date's already came in the right format
    res.redirect("/submitted");
});
app.post("/api/editLastPomo", async (req, res, next) => {
    const [catId, subcId] = req.body.catAndSubc.split("-");
    pomoRepository.editLastPomo(catId, subcId, req.body.date); //date's already came in the right format
    res.redirect("/submitted");
});