const Joi =require("joi");
//schema for server side validation
module.exports.listingSchema= Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        discription:Joi.string().required(),
        location:Joi.string().required(),
        price:Joi.number().required().min(0),
        country: Joi.string().required(),
        image:Joi.string().allow("",null)
    }).required()
});