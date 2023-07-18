const express = require("express");
const routes = require("./routes");
const exphbs = require("express-handlebars");
require("./config/mongoose"); // mongoose 連線
const Expense = require("./models/expense");
const methodOverride = require("method-override");
const session = require("express-session");
const usePassport = require("./config/passport");
const PORT = process.env.PORT || 3000;
const app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// express-session
app.use(
  session({
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: true,
  })
);
// passport
usePassport(app);
// auth
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});
app.use(routes);
// ----------新增----------
app.get("/expenses/new", (req, res) => {
  res.render("new");
});
app.post("/expenses", (req, res) => {
  const { name, date, category, amount } = req.body;
  return Expense.create({ name, date, category, amount })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

// ----------編輯----------
app.get("/expenses/:expenseId/edit", (req, res) => {
  const _id = req.params.expenseId;
  console.log("expenseId", _id);
  return Expense.find({ _id })
    .lean()
    .then(([data]) => {
      // console.log("data:", data);
      data.date = data.date.toISOString().substring(0, 10);
      res.render("edit", { data: data });
    })
    .catch((err) => console.log(err));
});
app.put("/expenses/:expenseId", (req, res) => {
  const _id = req.params.expenseId;
  const { name, category, date, amount } = req.body;
  return Expense.findOne({ _id })
    .then((resolve) => {
      resolve.name = name;
      resolve.date = date;
      resolve.category = category;
      resolve.amount = amount;
      resolve.save();
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

// ----------刪除----------
app.delete("/expenses/:expenseId", (req, res) => {
  const _id = req.params.expenseId;
  Expense.findByIdAndRemove(_id)
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log(err);
    });
});

app.listen(PORT, () => {
  console.log(`Express is listening on port ${PORT}`);
});
