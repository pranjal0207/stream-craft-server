import mongoose from "mongoose";

const UploaderUserSchema = new mongoose.Schema({
    user_id : {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
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
    subscribers: {
        type: Array,
        default: []
    },
    likedVideos : {
        type: Array,
        default: []
    },
    dislikedVideos : {
        type: Array,
        default: []
    },
    viewHistory : {
        type: Array,
        default: []
    },
    uploadedVideos: {
        type: Array,
        default: []
    },
    description: {
        type: String,
        required: true,
    },
    type : {
        type: String,
        enum: ['consumer', 'uploader', 'moderator'],
        required: true,
        default : "uploader"
    }
});

const UploaderUser = mongoose.model("UploaderUser", UploaderUserSchema);
export default UploaderUser;