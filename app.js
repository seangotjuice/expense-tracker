const express = require("express");
const exphbs = require("express-handlebars");
require("./config/mongoose"); // mongoose 連線
const Expense = require("./models/expense");

const app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.listen(3000, () => {
  console.log("Express is listening on port 3000");
});
