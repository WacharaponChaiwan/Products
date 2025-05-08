const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchem = new Schema({
  userid: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
  productid: { type: mongoose.Schema.ObjectId, ref: "product", required: true },
  totalprice: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  quantity: { type: Number, required: true, min: 1 },
});

module.exports = mongoose.model("order", orderSchem);
