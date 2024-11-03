const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new mongoose.Schema(
  {
    formulation_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { toJSON: { virtuals: true }, timestamps: true, collection: "formulation" }
);

const formulation = mongoose.model("formulation", schema);

module.exports = formulation;
