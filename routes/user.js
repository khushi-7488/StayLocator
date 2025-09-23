const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js")

router.route("/signup").get(userController.signup).post(wrapAsync(userController.signupValidate))


router.route("/login").get(userController.login).post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.loginValidate)


router.get("/logout", userController.logout)

module.exports = router;