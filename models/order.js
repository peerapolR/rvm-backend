const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      required: true,
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
      type: Schema.Types.Mixed,
      required: true,
    },
    dosage_form: {
      type: String,
      require: true,
    },
    formula: {
      type: String,
    },
    formular_name: {
      type: String,
      required: true,
    },
    master_ingredient: {
      type: Schema.Types.Mixed,
    },
    ingredient: {
      type: Schema.Types.Mixed,
    },
    packaging: {
      type: String,
      required: true,
    },
    packaging_detail: {
      type: String,
    },
    packaging_price: {
      type: String,
    },
    carton: {
      type: String,
      required: true,
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
      required: true,
    },
    moq: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
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
      enum: ["draft", "pending", "reject", "proposed", "approve"],
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
