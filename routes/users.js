var express = require("express");
var router = express.Router();
const users = require("../model/user.model");
const authorToken = require("../middleware/token.middleware");

router.put("/:id/approve", authorToken, async function (req, res, next) {
  let { approve } = req.body;
  let { id } = req.params;

  let user = await users.findByIdAndUpdate(id, { approve } , {new: true});

  if(user.approve != true){
    return res.status(400).json({
      status: 400,
      message: "appvrove is not true",
      data: {},
    });
  }

  res.json({
    status: 200,
    message: "Update Success",
    data: {
      usernaem: user.username,
      password: user.password,
      approve: user.approve,
    },
  });
});

module.exports = router;
