const Joi = require("joi");
const reviews = require("./models/reviews");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),   // <-- fixed spelling
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    // image: Joi.string().allow("", null)
    //in data image is an object 
    image: Joi.object({
      filename: Joi.string().default("listingimage"),
      url: Joi.string()
        .uri()
        .default(
          "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
        )
    }).required()
  }).required()
});


module.exports.reviewSchema = Joi.object({
  review:Joi.object({
    rataing:Joi.number().required().min(1).max(5),
    Comment:Joi.string().required(),
  }).required,
});