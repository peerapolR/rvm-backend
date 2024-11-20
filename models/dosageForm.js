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
    condition: {
      type: Schema.Types.Mixed,
    },
    standard: {
      type: String,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "dosage_form" }
);

const dosage_form = mongoose.model("dosage_form", schema);

module.exports = dosage_form;
