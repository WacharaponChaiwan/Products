const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({
      status: 401,
      message: "Invalid token",
    });
    req.auth = token
    next()
  } catch (error) {
    res.status(500).send(error);
  }
}