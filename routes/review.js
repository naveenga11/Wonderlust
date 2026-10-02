const express = require("express");
const router = express.Router({ mergeParams: true }); // ensure params are available
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,validateReview} = require("../middlewear.js");




// post review route
router.post(
  "/",
  validateReview,isLoggedIn,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    let newReview = new Review(req.body.review);
    await newReview.save();
    // push the review id (not the whole document)
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "New review Created !");
    res.redirect(`/listings/${listing._id}`);
  })
);

// delete review route
router.delete(
  "/:reviewId",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", " review deleted !");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
