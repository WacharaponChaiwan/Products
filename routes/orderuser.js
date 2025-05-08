var express = require("express");
var router = express.Router();
const order = require("../model/orderuser.model");

router.get("/", async function (req, res, next) {
  let orderAll = await order.find({});

  res.json({
    status: 200,
    message: "Success",
    data: orderAll
  });
});
module.exports = router;
