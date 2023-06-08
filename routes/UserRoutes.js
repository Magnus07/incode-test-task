var express = require("express");
var router = express.Router();
var UserController = require("../controllers/UserController.js");
const { requireAuth } = require("../utils/middlewares.js");

/*
 * GET
 */
router.get("/", requireAuth, UserController.list);

/*
 * POST
 */
router.post("/", requireAuth, UserController.create);

/*
 * LOGIN
 */
router.post("/login/password", UserController.login);

/*
 * SIGN UP
 */
router.post("/signup/password", requireAuth, UserController.signup);

/*
 * CHANGE BOSS
 */
router.post("/boss/change", requireAuth, UserController.changeBoss);

module.exports = router;
