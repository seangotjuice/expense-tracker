const express = require("express");
const router = express.Router();
const Expense = require("../../models/expense");
const Category = require("../../models/category");

// ----------新增----------
router.get("/new", (req, res) => {
  res.render("new");
});
router.post("", (req, res) => {
  const userId = req.user._id;
  // const categoryId = req.category._id;
  const { name, date, category, amount } = req.body;
  Category.findOne({ name: category })
    .then((data) => {
      const categoryId = data._id;

      return Expense.create({ name, date, amount, categoryId, userId })
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

// ----------編輯----------
router.get("/:expenseId/edit", (req, res) => {
  const _id = req.params.expenseId;
  const userId = req.user._id;
  console.log("expenseId", _id);
  return Expense.find({ _id, userId })
    .lean()
    .populate("categoryId")
    .then(([data]) => {
      console.log("data:", data);
      data.date = data.date.toISOString().substring(0, 10);
      res.render("edit", { data: data });
    })
    .catch((err) => console.log(err));
});
router.put("/:expenseId", (req, res) => {
  const userId = req.user._id;
  // const categoryId = req.category._id;
  const _id = req.params.expenseId;
  const { name, category, date, amount } = req.body;
  return Expense.findOne({ _id, userId })
    .populate("categoryId")
    .then((resolve) => {
      return Category.findOne({ name: category }).then((cat) => {
        resolve.name = name;
        resolve.date = date;
        resolve.categoryId = cat._id;
        resolve.amount = amount;
        console.log("resolve:", resolve);
        resolve.save();
      });
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

// ----------刪除----------
router.delete("/:expenseId", (req, res) => {
  const userId = req.user._id;
  // const categoryId = req.category._id;
  const _id = req.params.expenseId;
  Expense.deleteOne({ _id, userId })
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
