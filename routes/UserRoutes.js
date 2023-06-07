var express = require("express");
var router = express.Router();
var UserController = require("../controllers/UserController.js");
const { requireAuth, isBoss } = require("../utils/middlewares.js");

/*
 * GET
 */
router.get("/", requireAuth, UserController.list);

/*
 * GET
 */
router.get("/:id", UserController.show);

/*
 * POST
 */
router.post("/", requireAuth, UserController.create);

/*
 * PUT
 */
router.put("/:id", UserController.update);

/*
 * DELETE
 */
router.delete("/:id", UserController.remove);

/*
 * LOGIN
 */
router.post("/login/password", UserController.login);

/*
 * SIGN UP
 */
router.post("/signup/password", UserController.signup);

/*
 * LOGOUT
 */
router.post("/logout", UserController.logout);

/*
 * ADD SUBORDINATE
 */
router.post("/subordinates/add", isBoss, UserController.addSubordinate);

/*
 * FIND RECURSIVELY
 */
router.post("/find", requireAuth, UserController.findRecursively);

module.exports = router;
