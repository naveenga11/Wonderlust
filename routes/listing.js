const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , isOwner, validateListing} = require("../middlewear.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {Storage} = require("../cloudConfig.js")
const upload = multer({ Storage })




router
.route("/")
.get(wrapAsync(listingController.index)) // Index Route
.post(
    validateListing,
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)); // Create Route



// New Route
router.get("/new",isLoggedIn,listingController.RenderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) // Show Route
    .put(isLoggedIn , isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.UpdateListing)) //update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //delete route

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEdiForm));






module.exports = router; 
 