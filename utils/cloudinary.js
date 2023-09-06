require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  // secure: true,
  // cloud_name: "drtip56rs",
  // api_key: "898746842993941",
  // api_secret: "Z2cUrfB3B2C_Wxn1uHQ2XUTW4Ug",
  // secure: true,
});

module.exports = cloudinary;
