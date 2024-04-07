import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    user_id : {
        type: String,
        required: true,
        unique: true
    },
    username : {
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
    subscriptions: {
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
    }
});

const User = mongoose.model("User", UserSchema);
export default User;