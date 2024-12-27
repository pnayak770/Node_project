import mongoose from "mongoose";

const schema = new mongoose.Schema({
  originalname: {
    type: String,
    required: true,
  },
  newname: {
    type: String,
    required: true,
    unique: true,
  },

  size: {
    type: Number,
    required: true,
  },
});

const fileSchema = mongoose.model("files", schema);

module.exports = fileSchema;
