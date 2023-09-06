const express = require("express");
const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  deleteProduct,
  editProduct,
  getFarmersProduct,
} = require("../../controllers/productController");
// const { model } = require("mongoose");
const router = express.Router();
const upload = require("../../utils/multer");
const { verifyJwt } = require("../../middlewares/VerifyAccount");
// const Statistics = require("../models/statistics");

// const { sendPasswordReset } = require("../utils/nodemailer");

router.post("/create", upload.single("productImage"), verifyJwt, createProduct);
router.get("/my-product", verifyJwt, getFarmersProduct);
router.delete("/delete/:id", deleteProduct);
router.patch("/edit/:id", editProduct);
router.get("/get/:id", getSingleProduct);
router.get("/get-all", verifyJwt, getAllProduct);
// router.get("/get-all", getAllProduct);
// router.post("/login", loginUser);

module.exports = router;
