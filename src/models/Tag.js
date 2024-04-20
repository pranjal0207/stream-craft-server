import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  tagId: {
    type: Number,
    required: true,
    unique: true,
  },
  tagName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const Tag = mongoose.model("tags", tagSchema);

export default Tag;
