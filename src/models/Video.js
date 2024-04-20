import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  video_id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    min: 3,
  },
  description: {
    type: String,
    required: true,
    max: 200,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  uploaderId: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Array,
    default: [],
  },
  coordinates: {
    type: Array,
    default: [],
  },
  moderated: {
    type: Boolean,
    default: false,
  },
  tagId: {
    type: Number,
    default: -1,
  },
});

const Video = mongoose.model("Video", VideoSchema);
export default Video;
