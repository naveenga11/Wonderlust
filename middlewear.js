const { request } = require("express");
const wrapAsync = require("./utils/wrapAsync");
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema } = require("./schema.js");

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


//athuntification
module.exports.isOwner =async(req,res,next)=>{
   let { id } = req.params;
      const listingData = req.body.listing;
      let listing = await Listing.findById(id);
      if(curUser && !listing.owner.equals(res.locals.curUser._id)){
        req.flash("error" , "you dont have permission to edit");
        return res.redirect(`/listings/${id}`);
      }
};

module.exports.validateListing = (req, res, next) => {
  // validate the nested listing object (routes send req.body.listing)
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


// validate review
module.exports.validateReview = (req, res, next) => {
  // validate the nested review object (routes send req.body.review)
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};