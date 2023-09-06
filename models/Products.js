const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productPricePerkg: {
      type: Number,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productImage: String,
    productImage_id: String,
    productStock: {
      type: Number,
      required: true,
    },
    productDelivery: {
      type: String,
      default: "pickUp",
    },
    postBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Farmer",
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Products", productSchema);

module.exports = productModel;
