const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewear.js")
 

//sing up
router.get("/signup" ,(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup" , wrapAsync(async(req,res,next) => {
    try{
    let {username ,email, password}=req.body;
    const newuser=new User({email,username});
    const resgisterUser=await User.register(newuser , password);
    //auto login
    req.login(resgisterUser, (err)=>{
       if (err){
         return next(err);
       }
       req.flash("success" , "Welcome to wonderlust");
       res.redirect("/listings");
    })
    }catch(e){
         req.flash("error" ,e.message);
         res.redirect("/signup");
    }
}));

//login
router.get("/login" ,(req,res)=>{
    res.render("users/login.ejs");
});

//passport middlewear will handle it

router.post("/login", saveRedirectUrl,
    passport.authenticate('local' , { 
        failureRedirect: '/login' ,
        failureFlash : true}) ,
        async (req,res) => {
            req.flash("success", "Wlocome back!");
            let redirectUrl =res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
});

//logout
router.get("/logout" ,(req,res,next)=>{
    req.logOut((err)=>{
        if (err){
            return next(err);
        }
        req.flash("success", "logged out!");
        res.redirect("/listings");
    });
});

module.exports= router;