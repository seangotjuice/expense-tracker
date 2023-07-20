const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const User = require("../models/user");
const bcrypt = require("bcryptjs");

module.exports = (app) => {
  // 1. 初始化 passport 模組
  app.use(passport.initialize());
  app.use(passport.session());

  // 2. 設定Local Stategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return done(
                null,
                false,
                req.flash("warning_msg", "帳號或密碼輸入錯誤")
              );
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                return done(
                  null,
                  false,
                  req.flash("warning_msg", "密碼輸入錯誤")
                );
              }
              console.log("登入成功ㄜ");
              return done(null, user, req.flash("success_msg", "登入成功"));
            });
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
  ////////////////////////////
  // facebook
  passport.use(
    new FacebookStrategy(
      {
        clientID: "751794129968580",
        clientSecret: "77fcb071b7c15fb61e2619c16b091db0",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ["email", "displayName"],
      },
      function (accessToken, refreshToken, profile, done) {
        const { name, email } = profile._json;
        User.findOne({ email }).then((user) => {
          if (user) return done(null, user);
          // user 不存在的話 給他一組亂數密碼
          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(randomPassword, salt)) // 加鹽
            .then((hash) =>
              User.create({
                name,
                email,
                password: hash,
              })
            )
            .then((user) => done(null, user))
            .catch((err) => done(err, false));
        });
      }
    )
  );
};
