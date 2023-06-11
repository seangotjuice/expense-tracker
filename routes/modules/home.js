const express = require("express");
const router = express.Router();
const Expense = require("../../models/expense");

// 瀏覽全部（原本我寫的）
router.get("/", (req, res) => {
  return Expense.find()
    .lean()
    .then((exp) => {
      let total = 0;
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      exp.forEach((expense) => {
        total += expense.amount;
        expense.date = new Intl.DateTimeFormat("zh-TW", options).format(
          expense.date
        );
      });
      // console.log("首頁exp:", exp);
      // console.log("首頁total:", total);

      res.render("index", { exp, total });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
