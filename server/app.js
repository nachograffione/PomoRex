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