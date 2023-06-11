const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = (app) => {
  // 1. 初始化 passport 模組
  app.use(passport.initialize());
  app.use(passport.session());

  // 2. 設定Local Stategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        User.findOne({ email })
          .then((user) => {
            console.log(user);
            if (!user) {
              return done(null, false, {
                message: "that email is not registered",
              });
            }
            if (password !== user.password) {
              return done(null, false, { message: "password incorrect!" });
            }
            return done(null, user);
          })
          .catch((err) => done(err, false));
      }
    )
  );

  // 3. 序列化 反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      // 查詢 DB → 程式運作正常 → 回傳查找的結果 user → done(null, user)
      .then((user) => done(null, user))
      // 查詢 DB → 程式運作錯誤 → 回傳錯誤 → done(err, null)
      .catch((err) => done(err, null));
  });
};
