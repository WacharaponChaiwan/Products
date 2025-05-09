// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   try {
//     let token = req.headers.authorization;
//     if (!token) return res.status(401).json({
//       status: 401,
//       message: "Invalid token",
//     });
//     req.auth = token;
//     req.user = user;
//     next()
//   } catch (error) {
//     res.status(500).send(error);
//   }
// }

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Invalid token",
      });
    }

    // ถ้ามาในรูปแบบ "Bearer <token>" ให้ตัดคำว่า Bearer ออก
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ตรวจสอบ token ด้วย secret

    req.user = decoded; //  เข้า req.user
    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized or invalid token",
    });
  }
};