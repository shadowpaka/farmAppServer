const express = require("express");
const {
  createUser,
  loginUser,
  verify,
  getProfile,
  logOut,
} = require("../../controllers/userController");
const { verifyEmail, verifyJwt } = require("../../middlewares/VerifyAccount");
// const { model } = require("mongoose");
const router = express.Router();
// const Statistics = require("../models/statistics");

// const { sendPasswordReset } = require("../utils/nodemailer");

router.post("/signup", createUser);
router.post("/login", verifyEmail, loginUser);
router.post("/logout", verifyJwt, logOut);
router.get("/verify-email", verify);
router.get("/profile", verifyJwt, getProfile);

module.exports = router;
