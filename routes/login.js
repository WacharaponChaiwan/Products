var express = require("express");
var router = express.Router();
const users = require("../model/user.model");
const jwt = require('jsonwebtoken')


const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

router.post("/", async function (req, res, next) {
  let { username, password } = req.body;


  try {
    const user = await users.findOne({ username });

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "pls register",
        data: {},
      });
    }

    if (user.approve != true) {
      return res.status(401).json({
        status: 401,
        message: "user not approve",
      });
    }

    const isMacth = await user.comparePassword(password);

    if(!isMacth){
        return res.status(401).json({
          status: 401,
          message: "Password is not Macth",
          data: {},
        });
    }

    const token = jwt.sign({
      id:user.id,
      usernaem: user.username,
    },
    JWT_SECRET,{expiresIn: JWT_EXPIRES});

    res.json({
      status: 200,
      message: "Login Success",
      access_token: token,
      data: {
        usernaem: user.username,
        password: user.password,
        approve: user.approve,
      },
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
