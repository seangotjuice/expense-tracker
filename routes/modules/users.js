const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
// const { authenticator } = require("../middleware/auth");

router.get("/login", async (req, res, next) => {
  try {
    res.render("login");
  } catch (err) {
    next(err);
  }
});

router.post(
  "/login",
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        req.flash("warning_msg", "please fill in the form");
      }
      return next();
    } catch (err) {
      next(err);
    }
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get("/register", async (req, res, next) => {
  try {
    res.render("register");
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const isUserExisted = await User.exists({ email });
    const errors = [];
    // check
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: "Please complete the form" });
    }
    if (isUserExisted) {
      errors.push({ message: "User already exists!" });
    }
    if (password !== confirmPassword) {
      errors.push({ message: "Password doesn't match" });
    }
    if (errors.length) {
      return res.render("register", {
        errors,
        name,
        email,
        password,
        confirmPassword,
      });
    }
    // create user
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(password, salt, null);
    await User.create({ name, email, password: hash });
    req.flash("success_msg", "Successfully registered");
    return res.redirect("users/login");
  } catch (err) {
    next(err);
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    req.logout();
    req.flash("success_msg", "你已經成功登出。");
    res.redirect("/users/login");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
