const express = require("express");
const router = express.Router();
const Expense = require("../../models/expense");
const Category = require("../../models/category");

// 瀏覽全部
router.get("/", (req, res) => {
  const userId = req.user._id;
  const categoryId = req.query.categoryId; // 從查詢參數中獲取 categoryId
  const filter = categoryId ? { userId, categoryId: categoryId } : { userId };

  return Expense.find(filter)
    .populate("categoryId")
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
      // 取得 Category 資料
      return Category.find()
        .lean()
        .then((categories) => {
          // 傳遞 exp 和 categories 給模板引擎進行渲染
          console.log("首頁exp:", exp);
          console.log("首頁total:", total);
          // console.log("categories:", categories);
          res.render("index", { exp, total, categories });
        })
        .catch((err) => console.log(err));
      // res.render("index", { exp, total });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
