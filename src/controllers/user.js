import User from "../models/User.js";

export const getUserById = async (req, res) => {
    try {
        const id = req.params.user_id;
        const user = await User.findById(id);

        res.status(200).json({"message": user});
    } catch (error) {
        res.status(500).json({"message": error});
    }
}

export const updateEmailPassword = async (req, res) => {
    res.status(200).json({"message" : "Update Email Password"});
}