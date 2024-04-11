import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getUserById = async (req, res) => {
    try {
        const id = req.params.user_id;
        const user = await User.findOne({user_id : id});

        res.status(200).json({"message": user});
    } catch (error) {
        res.status(500).json({"message": error});
    }
}

export const updateEmailPassword = async (req, res) => {
    const id = req.params.user_id;
    const { email, password } = req.body;   

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const updatedUser = await User.findOneAndUpdate({user_id : id}, {email: email, password: passwordHash}, { new: true }); 

    res.status(200).json({"message" : updatedUser});
}