// Middleware to check if user is authenticated
module.exports.isLoggedIn=(req, res, next)=> {
  if (req.isAuthenticated()) {
    return next(); // user is logged in, continue
  }
  req.session.redirectUrl=req.originalUrl;  //create redirectUrl in req.session and store req.originalUrl in it
  req.flash("error","login to access this");
  res.redirect("/login"); // or res.status(401).send("Unauthorized");
}


//save redirect url
module.exports.saveRedirectUrl =(req, res, next )=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl =req.session.redirectUrl;
  }
  next();
};