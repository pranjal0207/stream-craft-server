import ConsumerUser from "../models/ConsumerUser.js";
import UploaderUser from "../models/UploaderUser.js";
import ModeratorUser from "../models/ModeratorUser.js";
import bcrypt from "bcrypt";
import Video from "../models/Video.js";

const getUserClass = (type) => {
  const isUploader = type === "uploader";
  const isModerator = type === "moderator";
  if (isUploader) {
    return UploaderUser;
  } else if (isModerator) {
    return ModeratorUser;
  }
  return ConsumerUser;
};

export const getUserById = async (req, res) => {
  try {
    const { type, user_id } = req.params;
    const UserClass = getUserClass(type);

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
    const UserClass = getUserClass(type);

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
    const loggedInId = req.body.id;
    const user = await UploaderUser.findOne({ user_id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: `UploaderUser ${userId} not found` });
    }

    const moderatorTypeFlag = req.body.type === "moderator";
    let canSeeModeratedVideoFlag = moderatorTypeFlag;

    if (!moderatorTypeFlag && userId === loggedInId) {
      canSeeModeratedVideoFlag = true;
    }

    const findParameters = {
      uploaderId: userId,
    };
    if (!canSeeModeratedVideoFlag) findParameters.moderated = false;

    const videos = await Video.find(findParameters);

    res.status(200).json({ uploaderId: userId, videos: videos });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getWatchedVideos = async (req, res) => {
  try {
    const { n } = req.query;
    const userId = req.params.userId;
    const user = await ConsumerUser.findOne({ user_id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: `ConsumerUser ${userId} not found` });
    }

    const watchedVideos = await Video.find({
      video_id: { $in: user.viewHistory },
    }).limit(parseInt(n));

    return res.status(200).json({ watchedVideos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getModeratedVideos = async (req, res) => {
  try {
    const { n } = req.query;

    const userId = req.params.userId;
    const user = await ModeratorUser.findOne({ user_id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ message: `ModeratorUser ${userId} not found` });
    }

    const moderatedVideos = await Video.find({
      video_id: { $in: user.moderatedVideos },
    }).limit(parseInt(n));

    return res.status(200).json({ moderatedVideos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const subscribeUser = async (req, res) => {
  try {
    const { uploaderId } = req.params;
    const userId = req.body.id;

    const user = await ConsumerUser.findOne({ user_id: userId });
    if (!user) {
      return res
        .status(404)

        .json({ message: `ConsumerUser ${userId} not found` });
    }

    const uploaderUser = await UploaderUser.findOne({ user_id: uploaderId });

    if (!uploaderUser) {
      return res
        .status(404)
        .json({ message: `UploaderUser ${userId} not found` });
    }

    if (user.subscriptions.includes(uploaderId)) {
      // remove from user subscriptions
      user.subscriptions = user.subscriptions.filter(
        (subscribedVideoId) => subscribedVideoId !== uploaderId
      );
      await user.save();

      // remove from uploader subscribers
      uploaderUser.subscribers = uploaderUser.subscribers.filter(
        (subscriberVideoId) => subscriberVideoId !== userId
      );
      await uploaderUser.save();

      res.status(200).json({
        message: `User ${userId} unsubscribed to ${uploaderId} successfully`,
      });
    } else {
      // add to user subscribtions
      user.subscriptions.push(uploaderId);
      await user.save();
      // add to uploader subscribers
      uploaderUser.subscribers.push(userId);
      await uploaderUser.save();
      res.status(200).json({
        message: `User ${userId} subscribed to ${uploaderId} successfully`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
