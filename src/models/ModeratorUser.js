import mongoose from "mongoose";

const ModeratorUserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    max: 50,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  lastName: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
  moderatedVideos: {
    type: Array,
    default: [],
  },
  type : {
      type: String,
      enum: ['consumer', 'uploader', 'moderator'],
      required: true,
      default : "consumer"
  }
});

const ModeratorUser = mongoose.model("ModeratorUser", ModeratorUserSchema);

export default ModeratorUser;
