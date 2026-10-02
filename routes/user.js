const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewear.js")
 
const userController = require("../controllers/users.js");
//sing up
router.get("/signup", userController.renderSignupForm);

router.post("/signup" , wrapAsync(userController.signup));

//login
router.get("/login" ,userController.renderLoginForm);

//passport middlewear will handle it

router.post("/login", saveRedirectUrl,
    passport.authenticate('local' , { 
        failureRedirect: '/login' ,
        failureFlash : true}) ,
    userController.login);

//logout
router.get("/logout" ,userController.logout);

module.exports= router;