const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  // username and password are added automatically by passport-local-mongoose
});

// Apply the plugin correctly
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
