const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsyanc = require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema}= require("./schema.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//validate listing
const validateListing = (req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  // console.log(result);
  //if error exits
  if(error){
    //addtional detail of error saparated by ","
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Index Route
app.get("/listings", wrapAsyanc(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id",wrapAsyanc(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//Create Route
app.post("/listings",validateListing, wrapAsyanc(async (req, res) => {
  // if(!req.body.listing){
  //   throw new ExpressError(400, "Send valid listing data!");
  // }
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsyanc(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id",validateListing,wrapAsyanc(async (req, res) => {
  // if(!req.body.listing){
  //   throw new ExpressError(400, "Send valid listing data!");
  // } 
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsyanc(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  res.redirect("/listings");
}));

//for all incoming req
app.all(/.*/,(req,res,next)=>{
  next(new ExpressError(404 , "page not found!"));
});

//custom error handler
app.use((err, req,res,next)=>{
  let {statusCode=500,message="Something went wrong!"}=err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});