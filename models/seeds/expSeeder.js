const Expense = require("../expense");
const User = require("../user");
const Category = require("../category");
const bcrypt = require("bcryptjs");

const db = require("../../config/mongoose");

const SEED_USER = {
  name: "root",
  email: "root@example.com",
  password: "12345678",
};

const ExpenseData = [
  { name: "dinner", amount: 340, date: "2021-06-01", category: "餐飲食品" },
  { name: "coffee", amount: 65, date: "2021-06-02", category: "餐飲食品" },
  { name: "rent", amount: 7000, date: "2021-06-01", category: "家居物業" },
];

const seedUser = async (data) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);
    return await User.create({
      name: data.name,
      email: data.email,
      password: hash,
    });
  } catch (err) {
    console.log(err);
  }
};
const seedExpense = async (data, categories, user) => {
  try {
    for (const expense of data) {
      await Expense.create({
        name: expense.name,
        date: expense.date,
        categoryId: categories[Math.floor(Math.random() * 5)]._id,
        amount: expense.amount,
        userId: user._id,
      });
    }
    console.log("expense created.");
  } catch (err) {
    console.log(err);
  }
};
db.once("open", async () => {
  try {
    console.log("mongodb connected!");
    const user = await seedUser(SEED_USER);
    const categories = await Category.find().lean();
    await seedExpense(ExpenseData, categories, user);

    process.exit();
  } catch (err) {
    console.log(err);
  }
});
