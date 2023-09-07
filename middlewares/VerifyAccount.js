const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Farmer = require("../models/Farmers");

const verifyJwt = (req, res, next) => {
  // console.log(req.cookie, req.cookies);
  let cookieBearer = req.headers?.authorization || req.headers?.Authorization;
  const cookie = cookieBearer?.split(" ")[1];
  // console.log("very", cookieBearer);
  // const cookie = req.cookies?.jwt;
  if (cookie) {
    const decode = jwt.verify(cookie, process.env.ACCESS_TOKEN_JWT_SECRET);
    if (decode) {
      req.userId = decode._id;
      next();
      // res.status(200).send({ status: "ok", msg: "token valid" });
    } else {
      res.status(400).send({ status: "error", msg: "invalid token" });
    }
  } else {
    res.status(500).send({ status: "error", msg: "No token was provided" });
  }
};
const verifyEmail = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .send({ status: "error", msg: "No user with this email" });
  const compared = await bcrypt.compare(password, user.password);
  // if (!user)
  //   res
  //     .status(400)
  //     .send({ status: "error", msg: "Email or password incorrect" });

  if (compared && user.isVerifed) {
    next();
  } else if (!compared) {
    return res
      .status(400)
      .send({ status: "error", msg: "Email or Password is incorrect" });
  } else {
    return res
      .status(400)
      .send({ status: "error", msg: "please verify your email" });
  }

  // if (user.isVerifed) {
  //   next();
  // } else {
  //  return res
  //     .status(400)
  //     .send({ status: "error", msg: "This email isn't verified please do so" });
  // }

  // next();
};
const verifyFarmerEmail = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Farmer.findOne({ email });
  if (!user)
    return res
      .status(400)
      .send({ status: "error", msg: "No user with this email" });
  const compared = await bcrypt.compare(password, user.password);
  // if (!user)
  //   res
  //     .status(400)
  //     .send({ status: "error", msg: "Email or password incorrect" });

  if (compared && user.isVerifed) {
    next();
  } else if (!compared) {
    return res
      .status(400)
      .send({ status: "error", msg: "Email or Password is incorrect" });
  } else {
    return res
      .status(400)
      .send({ status: "error", msg: "please verify your email" });
  }

  // if (user.isVerifed) {
  //   next();
  // } else {
  //  return res
  //     .status(400)
  //     .send({ status: "error", msg: "This email isn't verified please do so" });
  // }

  // next();
};
module.exports = { verifyJwt, verifyEmail, verifyFarmerEmail };
