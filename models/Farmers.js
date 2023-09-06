const mongoose = require("mongoose");

const farmerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: String,
  img_id: String,
  accountType: {
    type: String,
    default: "Farmer",
  },
  isVerifed: {
    type: Boolean,
    default: false,
  },
  emailToken: {
    type: String,
  },
});

const farmerModel = mongoose.model("Farmer", farmerSchema);

module.exports = farmerModel;
