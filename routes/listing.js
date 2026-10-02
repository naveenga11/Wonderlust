const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner, validateListing} = require("../middlewear.js");

const listingController = require("../controllers/listings.js");

// Index Route
router.get("/",wrapAsync(listingController.index));

// New Route
router.get("/new",isLoggedIn,listingController.RenderNewForm);

// Show Route
router.get("/:id",wrapAsync(listingController.showListing));

// Create Route
router.post("/",validateListing,isLoggedIn,wrapAsync(listingController.createListing));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEdiForm));

// Update Route
router.put("/:id",isLoggedIn,isOwner,  validateListing,wrapAsync(listingController.UpdateListing));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router; 
