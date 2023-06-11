const express = require("express");
const routes = require("./routes");
const exphbs = require("express-handlebars");
require("./config/mongoose"); // mongoose 連線
const Expense = require("./models/expense");
const Category = require("./models/category");
const methodOverride = require("method-override");
const category = require("./models/category");
const session = require("express-session");
const usePassport = require("./config/passport");

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

// // 瀏覽全部（觀摩newm1n)
// app.get("/", (req, res) => {
//   return Category.find()
//     .lean()
//     .then((categories) => {
//       return Expense.find()
//         .populate("categoryId")
//         .lean()
//         .sort({ date: "desc" })
//         .then((items) => {
//           let totalAmount = 0;
//           items.forEach((item) => {
//             totalAmount += item.amount;
//           });
//           return res.render("index", { items, categories, totalAmount });
//         })
//         .catch((err) => console.log(err));
//     });
// });

// // 瀏覽全部（原本我寫的）
// app.get("/", (req, res) => {
//   return Expense.find()
//     .lean()
//     .then((exp) => {
//       let total = 0;
//       const options = {
//         year: "numeric",
//         month: "numeric",
//         day: "numeric",
//       };
//       exp.forEach((expense) => {
//         total += expense.amount;
//         expense.date = new Intl.DateTimeFormat("zh-TW", options).format(
//           expense.date
//         );
//       });
//       console.log("首頁exp:", exp);
//       // console.log("首頁total:", total);

//       res.render("index", { exp, total });
//     })
//     .catch((err) => console.log(err));
// });

// // 瀏覽全部 （GPT給我的 為了拿filter)
// app.get("/", (req, res) => {
//   const selectedCategory = req.query.filter;

//   let query = {};

//   if (selectedCategory) {
//     query = { category: selectedCategory };
//   }
//   console.log("query", query);
//   return Expense.find(query)
//     .lean()
//     .then((exp) => {
//       let total = 0;
//       const options = {
//         year: "numeric",
//         month: "numeric",
//         day: "numeric",
//       };

//       exp.forEach((expense) => {
//         total += expense.amount;
//         expense.date = new Intl.DateTimeFormat("zh-TW", options).format(
//           expense.date
//         );
//       });

//       res.render("index", { exp, total });
//     })
//     .catch((err) => console.log(err));
// });

// ----------篩選----------
// Handle form submission and redirect based on selected category
// app.post("/", (req, res) => {
//   const { filter } = req.body;
//   console.log(filter);
//   console.log(req.body);
//   const selectedCategory = req.body.filter;
//   console.log("selectedCategory", selectedCategory);
//   if (selectedCategory) {
//     return res.redirect(`/?filter=${encodeURIComponent(selectedCategory)}`);
//   } else {
//     return res.redirect("/");
//   }
// });

app.listen(3000, () => {
  console.log("Express is listening on port 3000");
});
