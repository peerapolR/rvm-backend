const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new mongoose.Schema(
  {
    product_category: {
      type: String,
      required: true,
      trim: true,
      enum: ["supplement", "skincare", "cosmetic"],
    },
    ingredient_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    dose_min: {
      type: String,
      required: true,
    },
    dose_max: {
      type: String,
      required: true,
    },
    dose_clinical: {
      type: String,
    },
    leadTime: {
      type: Number,
      required: true,
    },
    price_min: {
      type: String,
      required: true,
    },
    price_max: {
      type: String,
      required: true,
    },
    chemical_comp: {
      type: String,
      required: true,
    },
    cert: {
      type: String,
    },
    health_benefits: {
      type: String,
      required: true,
    },
    ex_health_benefits: {
      type: String,
    },
    formulation: {
      type: Schema.Types.Mixed,
    },
    incomp_Ingredient: {
      type: Schema.Types.Mixed,
    },
    ingredient_image: { type: String },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    ingredient_status: {
      type: String,
      default: "draft",
      enum: ["draft", "publish", "unpublish"],
    },
    publishAt: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "ingredients" }
);

const ingredient = mongoose.model("ingredient", schema);

module.exports = ingredient;
