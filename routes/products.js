var express = require("express");
var router = express.Router();
const product = require("../model/product.model");
const orderuser = require("../model/orderuser.model");

router.get("/", async function (req, res, next) {
  let products = await product.find({});

  res.json({
    status: 200,
    message: "Success",
    data: products,
  });
});

router.get("/:id", async function (req, res, next) {
  let products = await product.findById(req.params.id);
  if (!products) {
    return res.send("Not found");
  }
  res.json({
    status: 200,
    message: "Get Success",
    data: {
      namemenu: products.namemenu,
      price: products.price,
      stock: products.stock,
      Category: products.Category,
    },
  });
});

router.post("/", async function (req, res, next) {
  let { namemenu, price, stock, Category } = req.body;

  const existingProduct = await product.findOne({ namemenu: namemenu });

  let products = new product({
    namemenu: namemenu,
    price: price,
    stock: stock,
    Category: Category,
  });

  if (existingProduct) {
    return res.status(400).json({
      status: 400,
      message: "Namemenu already exists",
    });
  }

  await products.save();

  res.status(201).json({
    status: 201,
    message: "Success",
    data: products,
  });
});

router.put("/:id", async function (req, res, next) {
  let { namemenu, price, stock, Category } = req.body;
  let { id } = req.params;

  let products = await product.findByIdAndUpdate(
    id,
    { namemenu, price, stock, Category },
    { new: true }
  );

  if (!products) {
    return res.status(404).json({ message: "Product not Found" });
  }

  res.json({
    status: 200,
    message: "Update Success",
    data: {
      namemenu: products.namemenu,
      price: products.price,
      stock: products.stock,
      Category: products.Category,
    },
  });
});

router.delete("/:id", async function (req, res, next) {
  let { id } = req.params;

  let products = await product.findByIdAndDelete(id);

  res.json({
    status: 200,
    message: "Delete Success",
  });
});

//UserProductNewOrder
router.get("/:id/orders", async function (req, res, next) {
  try {
    const product = req.params.id;
    const orderproduct = await orderuser
      .find({ productid: product })
      .populate("productid", "namemenu price");

    res.json({
      status: 200,
      message: "Success",
      data: orderproduct,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/orders", async function (req, res, next) {
  const productID = req.params.id;
  const { quantity, userid } = req.body;

  const product_id = await product.findById(productID);

  try {
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ status: 400, message: "Invalid Quantity" });
    }

    if (!productID) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid ProductID" });
    }

    if (product_id.stock < quantity) {
      return res
        .status(400)
        .json({
          status: 400,
          message: `Quantity is not enough to meet demand Remaining quantity ${product_id.stock}`,
        });
    }

    let orderofproduct = new orderuser({
      userid,
      productid: product_id,
      totalprice: quantity * product_id.price,
      quantity,
    });

    product_id.stock -= quantity;
    await product_id.save();

    await orderofproduct.save();

    console.log(orderofproduct);

    res.json({
      status: 201,
      message: "Create Success",
      data: orderofproduct,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send(error);
  }
});

module.exports = router;
