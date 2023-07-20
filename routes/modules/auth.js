// facebook
const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    // 設定成功或失敗分別要做什麼事情
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

module.exports = router;
