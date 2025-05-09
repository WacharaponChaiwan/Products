const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    namemenu: {type: String , unique: true},
    price: {type: Number},
    stock: {type: Number , min: 0},
    Category: {type: String }

}, {
    timestamps: true
  });

  module.exports = mongoose.model('product', productSchema);