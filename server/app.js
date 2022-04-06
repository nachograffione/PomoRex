// params
const port = 3000;

// start server
const express = require("express");
const app = express();
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// set EJS
const path = require("path");
app.set("view engine", "ejs");  //it will do require("ejs");
app.set("views", path.join(__dirname, "views"));

// routing
app.use("/", express.static(path.join(__dirname, "static/")));

app.use("/", (req, res, next) => {
    res.render("input.ejs");
});