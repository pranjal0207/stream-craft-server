import ConsumerUser from "../models/ConsumerUser.js";
import UploaderUser from "../models/UploaderUser.js";
import bcrypt from "bcrypt";
import Video from "../models/Video.js";

export const getUserById = async (req, res) => {
  try {
    const { type, user_id } = req.params;
    const UserClass = type === "uploader" ? UploaderUser : ConsumerUser;

    const user = await UserClass.findOne({ user_id: user_id });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateEmailPassword = async (req, res) => {
  try {
    const { type, user_id } = req.params;
    const { email, password } = req.body;
    const UserClass = type === "uploader" ? UploaderUser : ConsumerUser;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const updatedUser = await UserClass.findOneAndUpdate(
      { user_id: user_id },
      { email: email, password: passwordHash },
      { new: true }
    );

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getUploaderVideos = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UploaderUser.findOne({ user_id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: `UploaderUser ${userId} not found` });
    }
    const videos = await Video.find({ uploaderId: userId });

    res.status(200).json({ uploaderId: userId, videos: videos });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
