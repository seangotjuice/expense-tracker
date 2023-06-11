const express = require("express");
const router = express.Router();
const Expense = require("../../models/expense");

// ----------新增----------
router.get("/new", (req, res) => {
  res.render("new");
});
router.post("", (req, res) => {
  const { name, date, category, amount } = req.body;
  return Expense.create({ name, date, category, amount })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

// ----------編輯----------
router.get("/:expenseId/edit", (req, res) => {
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
router.put("/:expenseId", (req, res) => {
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
router.delete("/:expenseId", (req, res) => {
  const _id = req.params.expenseId;
  Expense.findByIdAndRemove(_id)
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;