import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import ConsumerUser from "../models/ConsumerUser.js";
import UploaderUser from '../models/UploaderUser.js';
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { type } = req.params;

        const UserClass = type === "uploader" ? UploaderUser : ConsumerUser;

        const user = await UserClass.findOne({email: email})
        
        if (!(user)) {
            return res.status(400).json({ "message": "ConsumerUser does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ "message": "Invalid credentials" });
        }

        const token = generateToken(user.user_id);

        const userObject = user.toObject();
        delete userObject.password;

        res.status(200).json ({ 
            "token" : token, 
            "user" : userObject,
            "type" : type
        });
    } catch (error) {
        res.status(500).json({"message" : error});
    }
}

export const createNewUser = async (req, res) => {
    try {
        const userData = req.body;
        const { type } = req.params;

        const isUploader = type === "uploader";
        const UserClass = isUploader ? UploaderUser : ConsumerUser;

        const savedUser = await createUser(userData, UserClass, isUploader);
        const token = generateToken(savedUser.user_id);

        const userObject = savedUser.toObject();
        delete userObject.password;

        res.status(200).json({
            user: userObject,
            type,
            token
        });
    } catch (error) {
        res.status(500).json({ "message": error});
    }
};

const createUser = async (userData, UserClass, isUploader = false) => {
    const userId = uuidv4();
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(userData.password, salt);
    const userObj = {
        user_id: userId,
        email: userData.email.toLowerCase(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: passwordHash
    };

    if (isUploader) {
        userObj.description = userData.description;
    }

    const newUser = new UserClass(userObj);
    return newUser.save();
};

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET);
