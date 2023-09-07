const connectDb = require("./config/connectDb");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const UsersRouterAuth = require("./routes/userRouter/user_auth");
const FarmersRouterAuth = require("./routes/farmerRouter/farmer_auth");
const ProductRouter = require("./routes/productRouter/product");
const PORT = process.env.PORT || 5000;

require("dotenv").config();
connectDb();
// app.use(cors());
app.use(
  cors({
    credentials: true,
    // origin: "http://localhost:3000",
    origin: "https://farm-app1.netlify.app",
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/farmer_auth", FarmersRouterAuth);
app.use("/user_auth", UsersRouterAuth);
app.use("/product", ProductRouter);

// connecting to Database

// app.get("/", (req, res) => {
//   res.status(200).json("sent");
// });

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to Db");
  app.listen(PORT, () => console.log(`app is listening on port ${PORT}`));
});

// app.listen(PORT, () => console.log(`app is listening on port ${PORT}`));
