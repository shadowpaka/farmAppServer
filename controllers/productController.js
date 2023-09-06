const cloudinary = require("../utils/cloudinary");
const Product = require("../models/Products");
const createProduct = async (req, res) => {
  const {
    productName,
    productCategorie,
    productDescription,
    productExpiry,
    productKg,
    productPricePerkg,
    productDelivery,
    postBy,
  } = req.body;
  // console.log(
  //   productName,
  //   productCategorie,
  //   productDescription,
  //   productExpiry,
  //   productKg,
  //   productPricePerkg,
  //   productDelivery,
  //   postBy
  // );
  //   console.log(req.file);
  if (
    !postBy ||
    !productName ||
    !productCategorie ||
    !productDescription ||
    !productExpiry ||
    !productKg ||
    !productPricePerkg ||
    !productDelivery
  ) {
    return res
      .status(400)
      .send({ status: "error", msg: "all fields must be filled" });
  }
  let img_id;
  let img_url;

  if (req.file) {
    let result = await cloudinary.uploader.upload(req.file.path, {
      folder: "farm_app_product",
    });
    img_url = result.secure_url;
    img_id = result.public_id;
  }
  // console.log(img_id, img_url);

  try {
    const product = await Product.create({
      productName,
      productPricePerkg: Number(productPricePerkg),
      productDescription,
      productStock: Number(productKg),
      productImage: img_url || "",
      productImage_id: img_id || "",
      productDelivery,
      postBy,
    });

    console.log("created", product);
    return res.status(201).send({
      status: "success",
      msg: "product posted successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      status: "error",
      msg: "something went wrong",
    });
  }
};

const getAllProduct = async (req, res) => {
  // console.log(req.headers?.authorization);
  console.log(req.userId);

  const product = await Product.find({}).populate("postBy").exec();
  if (product) {
    return res
      .status(200)
      .send({ status: "ok", msg: "products found", product });
  } else {
    return res
      .status(400)
      .send({ status: "ok", msg: "no products at the moment" });
  }
};

const getFarmersProduct = async (req, res) => {
  const userId = req.userId;

  const product = await Product.find({ postBy: userId });
  // console.log(product);
  if (product) {
    return res
      .status(200)
      .send({ status: "success", msg: "product found", product });
  } else {
    return res.status(400).send({ status: "error", msg: "No product found" });
  }
};

const getSingleProduct = async (req, res) => {
  console.log(req.param);
};
const editProduct = async (req, res) => {
  const { productId } = req.body;
};
const deleteProduct = async (req, res) => {
  const { productId } = req.body;
};

module.exports = {
  createProduct,
  getAllProduct,
  editProduct,
  deleteProduct,
  getSingleProduct,
  getFarmersProduct,
};
