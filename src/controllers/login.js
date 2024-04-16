import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email: email});
        if (!(user)) {
            return res.status(400).json({ "message": "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ "message": "Invalid credentials" });
        }

        const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET);

        const userObject = user.toObject();
        delete userObject.password;

        res.status(200).json ({ 
            "token" : token, 
            "user" : userObject
        });
    } catch (error) {
        res.status(500).json({"message" : error});
    }
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
    } catch (error) {
        res.status(500).json({"message" : error});
    }
}
