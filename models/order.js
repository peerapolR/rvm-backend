const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      unique: true,
      trim: true,
    },
    product_category: {
      type: String,
      required: true,
      trim: true,
      enum: ["supplement", "skincare", "cosmetic"],
    },
    formulation: {
      type: Array,
    },
    dosage_form: {
      type: String,
    },
    formula: {
      type: String,
    },
    formular_name: {
      type: String,
    },
    master_ingredient: {
      type: Array,
    },
    ingredient: {
      type: Array,
    },
    begin_master_ingredient: {
      type: Array,
    },
    begin_ingredient: {
      type: Array,
    },
    carton: {
      type: String,
    },
    carton_detail: {
      type: String,
    },
    carton_screen: {
      type: String,
    },
    carton_price: {
      type: String,
    },
    proposal_name: {
      type: String,
    },
    customer_name: {
      type: String,
    },
    proposal_code: {
      type: String,
    },
    address: {
      type: String,
    },
    sub_district: {
      type: String,
    },
    district: {
      type: String,
    },
    city: {
      type: String,
    },
    postal_code: {
      type: String,
    },
    tel: {
      type: String,
    },
    tax_id: {
      type: String,
    },
    contact_person: {
      type: String,
    },
    creator_id: {
      type: String,
    },
    order_status: {
      type: String,
      default: "draft",
      enum: [
        "draft",
        "pending",
        "reject",
        "approve",
        "success",
        "decline",
        "verify",
      ],
    },
    moq1: {
      type: String,
    },
    price1: {
      type: String,
    },
    packaging1: {
      type: String,
    },
    packaging_detail1: {
      type: String,
    },
    packaging_price1: {
      type: String,
    },
    moq2: {
      type: String,
    },
    price2: {
      type: String,
    },
    packaging2: {
      type: String,
    },
    packaging_detail2: {
      type: String,
    },
    packaging_price2: {
      type: String,
    },
    moq3: {
      type: String,
    },
    price3: {
      type: String,
    },
    packaging3: {
      type: String,
    },
    packaging_detail3: {
      type: String,
    },
    packaging_price3: {
      type: String,
    },
    prePrice: {
      type: String,
    },
    begin_prePrice: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "orders" }
);

const order = mongoose.model("order", schema);

module.exports = order;
