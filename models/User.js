const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
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
    isVerifed: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      default: "User",
    },
    emailToken: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { collection: "users" }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
