const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.usersignup));

// router.get("/signup",userController.renderSignUpForm);
// router.post("/signup",wrapAsync(userController.usersignup));
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(passport.authenticate("local" , {failureRedirect:"/login" , failureFlash:true}) , saveRedirectUrl, wrapAsync(userController.userlogin));

// router.get("/login" , userController.renderLoginForm);
// router.post("/login" , passport.authenticate("local" , {failureRedirect:"/login" , failureFlash:true}) , saveRedirectUrl, wrapAsync(userController.userlogin));

router.get("/logout", userController.userlogout);

module.exports=router;