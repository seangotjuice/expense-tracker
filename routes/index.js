const express = require("express");
const router = express.Router();
const expenses = require("./modules/expenses");
// const auth = require("./modules/auth");
const users = require("./modules/users");
const home = require("./modules/home");
const { authenticator } = require("../middleware/auth");

router.use("/expenses", authenticator, expenses);
router.use("/users", users);
// router.use("/auth", auth);
router.use("/", authenticator, home);

module.exports = router;
