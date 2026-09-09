const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

// validate listing
const validateListing = (req, res, next) => {
  // validate the nested listing object (routes send req.body.listing)
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error", "Listing you requested doesn't exit !");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// Create Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const listingData = req.body.listing;
    // if user left image blank, remove it so the model's default url kicks in
    if (!listingData.image || !listingData.image.url || !listingData.image.url.trim()) {
      delete listingData.image;
    } else {
      listingData.image.filename = listingData.image.filename || "listingimage";
    }
    const newListing = new Listing(listingData);
    await newListing.save();
    req.flash("success", "New listing Created !");
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested doesn't exit !");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listingData = req.body.listing;
    // if user cleared the image url, don't overwrite with an empty value
    if (!listingData.image || !listingData.image.url || !listingData.image.url.trim()) {
      delete listingData.image;
    } else {
      listingData.image.filename = listingData.image.filename || "listingimage";
    }
    await Listing.findByIdAndUpdate(id, { ...listingData });
    req.flash("success", " listing updated !");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted !");
    res.redirect("/listings");
  })
);

module.exports = router;
