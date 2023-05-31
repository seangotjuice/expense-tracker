const express = require("express");
const exphbs = require("express-handlebars");

const app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  //   res.send(`This is my first Express Web App`);
  res.render("index");
});

app.listen(3000, () => {
  console.log("Express is listening on port 3000");
});
