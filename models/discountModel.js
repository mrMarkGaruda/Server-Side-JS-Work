const mongoose = require("mongoose");
const { Schema } = mongoose;

const discountSchema = new Schema({
  discountCode: String,
  percentage: Number
});

module.exports = mongoose.model("Discount", discountSchema);
