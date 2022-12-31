const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    default: "Investment",
  },
  color: {
    type: String,
    required: true,
    default: "#FCBE44",
  },
});

const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "Anonymous" },
  type: { type: String, required: true, default: "Investment" },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
});

module.exports = {
  categoriesSchema,
  transactionSchema,
};
