var UserModel = require("../models/UserModel.js");
const bcrypt = require("bcrypt");

/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {
  /**
   * UserController.list()
   */
  list: function (req, res) {
    UserModel.findOne(
      { username: req.session.user.username },
      function (err, User) {
        if (err) {
          return res.status(500).json({
            message: "Error when getting User.",
            error: err,
          });
        }
        switch (User.role) {
          case "user":
            return res.json(User);
          case "boss":
            return res.json("I'm a boss!");
          case "admin":
            UserModel.find(function (err, Users) {
              if (err) {
                return res.status(500).json({
                  message: "Error when getting User.",
                  error: err,
                });
              }
              return res.json(Users);
            });
            break;
          default:
            return res
              .status(500)
              .json({ message: "Something went wrong. Can't get your role" });
        }
      }
    );
  },

  /**
   * UserController.show()
   */
  show: function (req, res) {
    var id = req.params.id;

    UserModel.findOne({ _id: id }, function (err, User) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting User.",
          error: err,
        });
      }

      if (!User) {
        return res.status(404).json({
          message: "No such User",
        });
      }

      return res.json(User);
    });
  },

  /**
   * UserController.create()
   */
  create: function (req, res) {
    var User = new UserModel({
      username: req.body.username,
      password: req.body.password,
      subordinates: req.body.subordinates,
    });

    User.save(function (err, User) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating User",
          error: err,
        });
      }

      return res.status(201).json(User);
    });
  },

  /**
   * UserController.update()
   */
  update: function (req, res) {
    var id = req.params.id;

    UserModel.findOne({ _id: id }, function (err, User) {
      if (err) {
        return res.status(500).json({
          message: "Error when getting User",
          error: err,
        });
      }

      if (!User) {
        return res.status(404).json({
          message: "No such User",
        });
      }

      User.username = req.body.username ? req.body.username : User.username;
      User.password = req.body.password ? req.body.password : User.password;
      User.subordinates = req.body.subordinates
        ? req.body.subordinates
        : User.subordinates;

      User.save(function (err, User) {
        if (err) {
          return res.status(500).json({
            message: "Error when updating User.",
            error: err,
          });
        }

        return res.json(User);
      });
    });
  },

  /**
   * UserController.remove()
   */
  remove: function (req, res) {
    var id = req.params.id;

    UserModel.findByIdAndRemove(id, function (err, User) {
      if (err) {
        return res.status(500).json({
          message: "Error when deleting the User.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },

  /**
   * UserController.login()
   */
  login: async function (req, res) {
    const body = req.body;

    const user = await UserModel.findOne({ username: body.username });
    if (user) {
      // check user password with hashed password stored in the database
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        session = req.session;
        session.user = user;
        res.json(user);
      } else {
        res.status(400).json({ error: "Invalid Login or Password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
  },

  /**
   * UserController.signup()
   */
  signup: async function (req, res) {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    var user = new UserModel({
      username: req.body.username,
      password: hashedPassword,
      subordinates: [],
      role: "user",
    });
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      var user = {
        id: this.lastID,
        username: req.body.username,
      };
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  },

  /**
   * UserController.logout()
   */
  logout: function (req, res) {
    req.session.destroy();
    res.status(200).json("Logged out");
  },

  /**
   * UserController.addSubordinate()
   */
  addSubordinate: function (req, res) {
    res.status(200).json("Add subordinate");
  },
};
