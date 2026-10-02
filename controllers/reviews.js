const Review =require("../models/review") ;
const Listing = require("../models/listing") 

module.exports.createReview = async (req, res) => {
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
  };

module.exports.distroyReview  = async (req, res) => {
    let { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", " review deleted !");
    res.redirect(`/listings/${id}`);
  };