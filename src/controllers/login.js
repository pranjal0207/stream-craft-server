import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import User from "../models/User.js";

export const login = async (req, res) => {
    res.status(200).json({"message" : "login"});
}

export const createNewUser = async (req, res) => {
    try {
        const {
            username,
            firstName,
            lastName,
            email,
            password
        } = req.body;

        const newUserId = uuidv4();

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            user_id : newUserId,
            username : username,
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: passwordHash,
            subscriptions: [],
            likedVideos : [],
            dislikedVideos : [],
            viewHistory : []
        });

        const saveUser = await newUser.save();
        
        res.status(200).json({"message" : saveUser});
    } catch (err) {
        res.status(500).json({"message" : err});
    }
}
