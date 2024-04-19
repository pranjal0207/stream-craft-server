import ConsumerUser from "../models/ConsumerUser.js";
import UploaderUser from "../models/UploaderUser.js";
import bcrypt from "bcrypt";

export const getUserById = async (req, res) => {
    try {
        const {type, user_id}= req.params;
        const UserClass = type === "uploader" ? UploaderUser : ConsumerUser;

        const user = await UserClass.findOne({user_id : user_id});
        
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({"message": error});
    }
}

export const updateEmailPassword = async (req, res) => {
    try {
        const {type, user_id}= req.params;
        const { email, password } = req.body;   
    
        const UserClass = type === "uploader" ? UploaderUser : ConsumerUser;
    
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
    
        const updatedUser = await UserClass.findOneAndUpdate({user_id : user_id}, {email: email, password: passwordHash}, { new: true }); 
    
        res.status(200).json({"user" : updatedUser});
    } catch (error) {
        res.status(500).json({"message": error});
    }
}