const express = require("express");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
// This will merge your parent with child
const router = express.Router({mergeParams: true}); 
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/user.js")

//Signup Routes
router.route("/signup")
.get(userController.getSignup)
.post(userController.postSignup)

//Login Routes
router.route("/login")
.get( userController.getLogin)
.post( saveRedirectUrl, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), userController.postLogin)

//Logout Route
router.get("/logout", userController.logout)
module.exports = router;
