var passport = require("passport");
var LocalStrategy = require("passport-local");
var UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

module.exports.requireAuth = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized!" });
  }
};

passport.use(
  new LocalStrategy(function verify(username, password, cb) {
    UserModel.findOne({ username: username }, async function (err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false, { message: "Incorrect username or password." });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return cb(null, false, {
          message: "Incorrect username or password.",
        });
      }
      return cb(null, user);
    });
  })
);
