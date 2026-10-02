const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res,next) => {
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
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login =         async (req,res) => {
            req.flash("success", "Wlocome back!");
            let redirectUrl =res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if (err){
            return next(err);
        }
        req.flash("success", "logged out!");
        res.redirect("/listings");
    });
};