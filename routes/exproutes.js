const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const categoriesSchema = require("../schemas/apiSchema").categoriesSchema;
const transactionSchema = require("../schemas/apiSchema").transactionSchema;

//creating mongoose model
const Category = new mongoose.model("Category", categoriesSchema);
const Transaction = new mongoose.model("Transaction", transactionSchema);
// get all categories
router.get("/categories", (req, res) => {
  Category.find()
    .then((data) => {
      let result = data.map((category) =>
        Object.assign({}, { type: category.type, color: category.color })
      );
      return res.status(200).json(result);
    })
    .catch((err) => res.status(404).json({ error: `data not found ${error}` }));
});

// post a categories
router.post("/categories", (req, res) => {
  const newCategory = new Category(req.body);
  newCategory
    .save()
    .then(() => {
      res.status(200).json({ message: "categories successfully inserted." });
    })
    .catch((err) =>
      res.status(500).json({ error: "failed to insert categories!!" })
    );
});

// get all transaction
router.get("/transactions", (req, res) => {
  Transaction.find()
    .then((data) => {
      let result = data.map((t) =>
        Object.assign({}, { name: t.name, type: t.type, amount: t.amount })
      );
      return res.status(200).json(result);
    })
    .catch((err) => res.status(404).json({ error: `data not found ${err}` }));
});

// post a transaction
router.post("/transactions", (req, res) => {
  if (!req.body) return res.status(422).json("Post HTTP Data not Provided");
  const { name, type, amount } = req.body;
  const newTransation = new Transaction({
    name,
    type,
    amount,
    date: new Date(),
  });
  newTransation
    .save()
    .then(() => {
      res.status(200).json({ message: "Transaction successfully inserted." });
    })
    .catch((err) =>
      res.status(500).json({ error: "failed to insert Transaction!!" })
    );
});

// delete a transaction
router.delete("/transactions", (req, res) => {
  if (!req.body) res.status(400).json({ message: "Request body not Found" });
  Transaction.deleteOne(req.body)
    .then(() =>
      res.status(200).json({ message: "transaction deleted successfully!!" })
    )
    .catch((err) => res.status(500).json({ error: err.message }));
});

// get labels
router.get("/labels", (req, res) => {
  Transaction.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "type",
        foreignField: "type",
        as: "categories_info",
      },
    },
    {
      $unwind: "$categories_info",
    },
  ])
    .then((result) => {
      let data = result.map((v) =>
        Object.assign(
          {},
          {
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color: v.categories_info["color"],
          }
        )
      );
      res.status(200).json(data);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
