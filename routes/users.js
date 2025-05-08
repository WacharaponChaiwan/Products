var express = require("express");
var router = express.Router();
const users = require("../model/user.model");

router.put("/:id/approve", async function (req, res, next) {
  let { approve } = req.body;
  let { id } = req.params;

  let user = await users.findByIdAndUpdate(id, { approve } , {new: true});

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
