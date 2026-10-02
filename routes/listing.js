const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner, validateListing} = require("../middlewear.js");

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// New Route
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
      req.flash("error", "Listing you requested doesn't exit !");
      return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  })
);

// Create Route
router.post(
  "/",
  validateListing,isLoggedIn,
  wrapAsync(async (req, res) => {
    const listingData = req.body.listing;
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id; // Set the owner of the listing to the currently logged-in user
    await newListing.save();
    req.flash("success", "New listing Created !");
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested doesn't exit !");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update Route
router.put(
  "/:id",
  isLoggedIn,isOwner,  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...listingData });
    req.flash("success", " listing updated !");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  "/:id",isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted !");
    res.redirect("/listings");
  })
);

module.exports = router;
