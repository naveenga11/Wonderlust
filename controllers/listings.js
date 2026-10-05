const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.RenderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested doesn't exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    const listingData = req.body.listing;
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    // if a file was uploaded, use Cloudinary url/filename; otherwise keep model default
    if (req.file) {
        newListing.image = { url: req.file.path, filename: req.file.filename };
    }
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderEdiForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested doesn't exist!");
      return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.UpdateListing = async (req, res) => {
    let { id } = req.params;
    const listingData = req.body.listing;                          // fix: was undefined
    let listing = await Listing.findByIdAndUpdate(id, { ...listingData }, { new: true });
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};
