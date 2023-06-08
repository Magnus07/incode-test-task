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
  list: async function (req, res) {
    let users = await UserModel.findOne({
      username: req.session.user.username,
    });
    res.status(200).json(users);
  },

  /**
   * UserController.create()
   */
  create: async function (req, res) {
    const salt = await bcrypt.genSalt(10);
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    } catch {
      return res.status(500).json({
        message: "Password should be provided!",
      });
    }

    var User = new UserModel({
      username: req.body.username,
      password: hashedPassword,
      parent: req.session.user,
    });

    User.save(function (err, User) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating User",
          error: err,
        });
      }

      UserModel.findByIdAndUpdate(
        req.session.user._id,
        { $push: { subordinates: User._id } },
        function (err, ParentUser) {
          if (err) {
            return res.status(500).json({
              message:
                "Error when updating subordinates for " + ParentUser.username,
              error: err,
            });
          }
          return res.status(201).json(User);
        }
      );
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
   * UserController.changeBoss()
   */
  changeBoss: async function (req, res) {
    let users = await UserModel.findOne({
      username: req.session.user.username,
    });

    // if change itself
    if (req.session.user.username === req.body.makeSubordinate) {
      return res
        .status(406)
        .json({ message: "You can change boss only to your subordinates!" });
    }

    // recursive lookup for usernames in retirned document
    function searchJSON(obj, key) {
      let results = [];
      results.push(obj[key]);
      if (obj.subordinates !== undefined) {
        for (let item of obj["subordinates"]) {
          results = results.concat(searchJSON(item, key));
        }
      }
      return results;
    }
    let subordinates = searchJSON(users, "username");

    let makeBossDoc;
    let oldParent;

    // if boss can reach its subordinates
    if (
      subordinates.includes(req.body.makeSubordinate) &&
      subordinates.includes(req.body.makeBoss)
    ) {
      makeBossDoc = await UserModel.findOne({
        username: req.body.makeBoss,
      }).exec();
      let makeSubordinateDoc = await UserModel.findOne({
        username: req.body.makeSubordinate,
      }).exec();
      oldParent = await UserModel.findOne({
        _id: makeSubordinateDoc.parent,
      }).exec();

      // if we're swaping documents
      if (makeBossDoc.parent.equals(makeSubordinateDoc._id)) {
        oldParent.subordinates.push(makeBossDoc);
        makeBossDoc.parent = oldParent;
      }

      // change "pointers"
      makeBossDoc.subordinates.push(makeSubordinateDoc);
      makeSubordinateDoc.parent = makeBossDoc;
      makeSubordinateDoc.subordinates = makeSubordinateDoc.subordinates.filter(
        (item) => !item._id.equals(makeBossDoc._id)
      );

      oldParent.subordinates = oldParent.subordinates.filter(
        (item) => !item._id.equals(makeSubordinateDoc._id)
      );

      await oldParent.save();
      await makeBossDoc.save();
      await makeSubordinateDoc.save();
    } else {
      res.status(403).json({ message: "Forbidden." });
    }

    res.status(200).json({ message: "Successful." });
  },
};
