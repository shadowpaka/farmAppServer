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

    return res.status(201).send({
      status: "success",
      msg: "product posted successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      msg: "something went wrong",
    });
  }
};

const getAllProduct = async (req, res) => {
  // console.log(req.headers?.authorization);

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
  const productId = req.params.id;
  const { productStock, productPricePerkg, productDescription } = req.body;

  const product = await Product.updateOne(
    {
      _id: productId,
    },
    {
      $set: {
        productDescription: productDescription,
        productStock: Number(productStock),
        productPricePerkg: Number(productPricePerkg),
      },
    }
  );
  if (product.modifiedCount > 0) {
    return res
      .status(200)
      .send({ status: "ok", msg: "product edited successfully" });
  } else {
    return res
      .status(400)
      .send({ status: "error", msg: "something went wrong" });
  }

  // if (userId != product.postBy._id) {
  //   return res
  //     .status(400)
  //     .send({ status: "error", msg: "You aren't authorised to edit this product" });
  // }else {
  //   console.log("edit")
  // }
};
const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  const product = await Product.deleteOne({
    _id: productId,
  });

  if (product.deletedCount > 0) {
    return res
      .status(200)
      .send({ status: "ok", msg: "product deleted successfully" });
  } else {
    return res
      .status(400)
      .send({ status: "error", msg: "something went wrong" });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  editProduct,
  deleteProduct,
  getSingleProduct,
  getFarmersProduct,
};
