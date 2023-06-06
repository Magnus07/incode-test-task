var express = require("express");
var router = express.Router();
var UserController = require("../controllers/UserController.js");
/*
 * GET
 */
router.get("/", UserController.list);

/*
 * GET
 */
router.get("/:id", UserController.show);

/*
 * POST
 */
router.post("/", UserController.create);

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

module.exports = router;
