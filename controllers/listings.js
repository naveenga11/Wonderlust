const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }

module.exports.RenderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {     //nested populate
        path: "author" ,
        },
      }) 
      .populate("owner");
    if(!listing){
      req.flash("error", "Listing you requested doesn't exit !");
      return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

module.exports.createListing = async (req, res,next) => {
   let url= req.file.path;
   let filename = req.file.filename;
    const listingData = req.body.listing;
    const newListing = new Listing(listingData);
    newListing.owner = req.user._id; // Set the owner of the listing to the currently logged-in user
    newListing.image = {url,filename}; 
    await newListing.save();
    req.flash("success", "New listing Created !");
    res.redirect("/listings");
  };

module.exports.renderEdiForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested doesn't exit !");
      return res.redirect("/listings");
    }
    //image preview
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload" ,"/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing });
  };

module.exports.UpdateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...listingData });

    if(req.file){
      let url= req.file.path;
      let filename = req.file.filename;
      listing.image = {url,filename}; 
      await listing.save(); 
    }
    req.flash("success", " listing updated !");
    res.redirect(`/listings/${id}`);
  };

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " listing deleted !");
    res.redirect("/listings");
  };