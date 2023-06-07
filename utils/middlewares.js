const UserModel = require("../models/UserModel");

module.exports.requireAuth = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized!" });
  }
};

module.exports.isBoss = function (req, res, next) {
  if (req.session.user) {
    UserModel.findOne(
      { username: req.session.user.username },
      function (err, User) {
        if (err) {
          return next(err);
        }
        if (User.hasAccess("boss")) {
          next();
        } else {
          res
            .status(401)
            .json({ error: "You need to be boss to perform this action!" });
        }
      }
    );
  } else {
    res.status(401).json({ error: "Unauthorized!" });
  }
};
