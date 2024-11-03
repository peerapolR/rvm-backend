const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new mongoose.Schema(
  {
    dosage_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "dosage_form" }
);

const dosage = mongoose.model("dosage", schema);

module.exports = dosage;
