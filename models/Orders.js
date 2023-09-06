const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Products",
  },
  productOwner: {
    type: mongoose.Schema.ObjectId,
    ref: "Farmer",
  },
  productBuyer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.model("Order", orderSchema);

module.exports = orderModel;
