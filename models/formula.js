const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new mongoose.Schema(
  {
    pattern_code: {
      type: String,
      required: true,
      trim: true,
    },
    product_category: {
      type: String,
      required: true,
      trim: true,
      enum: ["supplement", "skincare", "cosmetic"],
    },
    formula_code: {
      type: String,
      required: true,
      trim: true,
    },
    formula_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    formula_type: {
      type: String,
      trim: true,
      default: "prototype",
      enum: ["prototype", "concept", "sale-custom"],
    },
    formulation: {
      type: Array,
    },
    dosage_form: {
      type: String,
      trim: true,
    },
    master_ingredient: {
      type: Array,
    },
    ingredient: {
      type: Array,
    },
    createdBy: {
      type: String,
      trim: true,
    },
    formula_status: {
      type: String,
      default: "draft",
      enum: ["draft", "publish", "cancle", "proposed", "approve"],
    },
    price: {
      type: String,
    },
    approved: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "formulas" }
);

const formula = mongoose.model("formula", schema);

module.exports = formula;
