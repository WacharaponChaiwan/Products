var express = require("express");
var router = express.Router();
const product = require("../model/product.model");
const orderuser = require("../model/orderuser.model");
const authorToken = require("../middleware/token.middleware");

router.get("/", authorToken, async function (req, res, next) {
  let products = await product.find({});

  res.json({
    status: 200,
    message: "Success",
    data: products,
  });
});

router.get("/:id", authorToken, async function (req, res, next) {
  let products = await product.findById(req.params.id);
  if (!products) {
    return res.status(404).json({
      status: 404,
      message: "Menu not found",
    });
  }
  res.status(200).json({
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

router.post("/", authorToken, async function (req, res, next) {
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
      data: null,
    });
  }

  await products.save();

  res.status(201).json({
    status: 201,
    message: "Success",
    data: products,
  });
});

router.put("/:id", authorToken, async function (req, res, next) {
  let { namemenu, price, stock, Category } = req.body;
  let { id } = req.params;

  let products = await product.findByIdAndUpdate(
    id,
    { namemenu, price, stock, Category },
    { new: true }
  );

  if (!products) {
    return res.status(404).json({ message: "Product not Found" , data: null });
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

router.delete("/:id", authorToken, async function (req, res, next) {
  try {
    const { id } = req.params;

    const deletedProduct = await product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
        data: null,
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Delete Success",
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

//UserProductNewOrder
router.get("/:id/orders", authorToken, async function (req, res, next) {
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

router.post("/:id/orders", authorToken, async function (req, res, next) {
  try {
    const productID = req.params.id;
    const { quantity } = req.body;
    const userid = req.user?.id;

    const product_id = await product.findById(productID);
    

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ status: 400, message: "Invalid Quantity",data: null, });
    }

    if (!product_id) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid ProductID" , data: null,});
    }

    if (product_id.stock < quantity) {
      return res.status(400).json({
        status: 400,
        message: `Quantity is not enough to meet demand Remaining quantity ${product_id.stock}`,
        data: null,
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
      status: 200,
      message: "Success",
      data: orderofproduct,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send(error);
  }
});

module.exports = router;
