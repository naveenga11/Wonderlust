const express = require("express");
const router = express.Router({ mergeParams: true }); // ensure params are available
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middlewear.js");

const reviewController = require("../controllers/reviews.js");


// post review route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewControlle.createReview));

// delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControlle.distroyReview));

module.exports = router; 