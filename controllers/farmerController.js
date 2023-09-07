const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/Farmers");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { google } = require("googleapis");
require("dotenv").config();
// google o2auth client id and secrets
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const createUser = async (req, res) => {
  console.log(req.body);
  const { email, name, phone, password, confirmPassword } = req.body;
  if (!email || !name || !phone || !password || !confirmPassword) {
    return res
      .status(400)
      .send({ status: "error", msg: "please enter all fields" });
  }
  if (typeof email !== "string") {
    return res.status(400).send({ status: "error", msg: "invalid email" });
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(String(email).toLocaleLowerCase())) {
    return res
      .status(400)
      .send({ status: "error", msg: "please enter a valid email" });
  }
  //   Check for duplicate email
  const emailCheck = await User.findOne({ email });
  if (emailCheck) {
    return res.status(400).send({
      status: "error",
      msg: "email or phone number already in use by another user",
    });
  }
  const phoneCheck = await User.findOne({ phone });
  if (phoneCheck) {
    return res.status(400).send({
      status: "error",
      msg: "email or phone number already in use by another user",
    });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .send({ status: "error", msg: "passwords do not match" });
  }
  if (typeof password !== "string") {
    return res.status(400).send({ status: "error", msg: "invalid password" });
  }
  if (password.length < 6) {
    return res.status(400).send({
      status: "error",
      msg: "password must be at least six characters long",
    });
  }

  //Generating email token for verification
  //   const emailToken = jwt.sign({ email, name }, process.env.EMAIL_JWT_SECRET);
  try {
    //Encrypting password
    const passwordHash = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      phone,
      password: passwordHash,
      emailToken: crypto.randomBytes(64).toString("hex"),
      img: "",
      img_id: "",
    });
    await user.save();
    // sendVerificationEmail(user.name, user.email, req, user.emailToken);

    try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        requireTLS: false,
        secure: true,
        auth: {
          type: "OAuth2",
          user: process.env.MAIL_USER,
          //   pass: process.env.MAIL_PASS,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
      transport.sendMail(
        {
          from: `"Farm App " <farmapp190@gmail.com>`,
          to: user.email,
          subject: "Verify Account",
          html: `<h1>Verify Your Account</h1>
        <h2>Hi ${user.name},</h2>
        <p>${user.name} Thanks for creating an account with us Today</p>
        <a href="http://${req.headers.host}/farmer_auth/verify-email?token=${user.emailToken}">Click here to verify your account</a>
        <p>Cheers</p>
        <p>Your Farm App Service team</p>
        </div>`,
        },
        (err, info) => {
          if (err) {
            console.log("err", err);
            return res
              .status(422)
              .send({ status: "conflict", msg: "something went wrong" });
          } else {
            console.log("verification sent to your email" + " " + user.email);
            return res.status(200).send({
              status: "success",
              msg: "verification send to your email",
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }

    return res
      .status(201)
      .send({ status: "ok", msg: "user created please verify account" });
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .send({ status: "error", msg: "some error occurred", error });
  }
};
const verify = async (req, res) => {
  const emailToken = req.query.token;
  const user = await User.findOne({ emailToken });
  if (user) {
    user.emailToken = null;
    user.isVerifed = true;
    await user.save();
    res.status(200).send({ status: "ok", msg: "verification successfull" });
  } else {
    res.status(400).send({ status: "error", msg: "verification failed" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //Checks
  if (!email || !password) {
    return res
      .status(400)
      .send({ status: "error", msg: "Please enter all fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .send({ status: "error", msg: "email or password is incorrect" });
  }

  try {
    const user = await User.findOne({ email }).lean();
    // console.log(user);

    if (!user) {
      return res
        .status(400)
        .send({ status: "error", msg: "email or password is incorrect" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);

    if (comparePassword) {
      //   Generating token
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        process.env.ACCESS_TOKEN_JWT_SECRET
      );
      delete user.password;
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res
        .status(200)
        .send({ status: "ok", msg: "Successful log in", user, token });
    } else {
      return res
        .status(400)
        .send({ status: "error", msg: "email or password is incorrect" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .send({ status: "error", msg: "Some error occurred", error });
  }
};
const getProfile = async (req, res) => {
  const userId = req.userId;
  if (userId) {
    const user = await User.findById(userId).select("-password");
    return res.status(200).send({ status: "ok", msg: "User Found", user });
  } else {
    return res.status(400).send({ status: "error", msg: "no user found" });
  }
};

const logOut = (req, res) => {
  if (req.userId) {
    return res
      .status(200)
      .send({ status: "success", msg: "logged out successfull" });
  } else {
    return res
      .status(200)
      .send({ status: "error", msg: "something went wrong" });
  }
  // res
  //   .cookie("jwt", "", {
  //     httpOnly: true,
  //     sameSite: "none",
  //     secure: true,
  //   })
  //   .send({ status: "success", msg: "logged out successfull" });
};

module.exports = {
  createUser,
  loginUser,
  verify,
  getProfile,
  logOut,
};
