const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    req.flash("warning_msg", "請填完表格");
    return res.render("register");
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        // console.log("user already exist");
        // console.log(user);
        req.flash("warning_msg", "您已註冊過");
        res.render("register", { name, email, password, confirmPassword });
      } else {
        // console.log("user does not exist");
        return bcrypt
          .hash(password, 10)
          .then((hash) => {
            User.create({ name, email, password: hash });
          })
          .then(() => res.redirect("/"))
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "你已經成功登出。");
  res.redirect("/users/login");
});

module.exports = router;
