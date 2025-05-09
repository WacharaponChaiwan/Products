var express = require("express");
var router = express.Router();
const users = require("../model/user.model");

router.post("/", async function (req, res, next) {
  let { username, password } = req.body;

  try {
    const existingUser = await users.findOne({ username });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: 400, message: "Username already exists", data: null });
    }

    let user = new users({
      username: username,
      password: password,
    });

    await user.save();
    res.json({
      status: 201,
      message: "Create Success",
      data: { usernaem: user.username, password: user.password },
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
