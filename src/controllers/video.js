import { v4 as uuidv4 } from "uuid";
import ConsumerUser from "../models/ConsumerUser.js";
import UploaderUser from "../models/UploaderUser.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";
import { deleteFolderFromS3 } from "../services/s3/delete.js";
import { getSignedUrl } from "../services/s3/get.js";
import Tag from "../models/Tag.js";
import ModeratorUser from "../models/ModeratorUser.js";

export const getVideoByID = async (req, res) => {
  // If token is present a video url will also be generated.
  try {
    const videoId = req.params.videoId;
    const userId = req.body.id;

    // Checking type of user & if it is uploader user then they should be able to see moderated video
    const moderatorTypeFlag = req.body.type === "moderator";
    let canSeeModeratedVideoFlag = moderatorTypeFlag;

    if (!moderatorTypeFlag && userId) {
      const user = await UploaderUser.findOne({ user_id: userId });
      if (user)
        canSeeModeratedVideoFlag = user.uploadedVideos.includes(videoId);
    }

    const video = await Video.findOne({
      video_id: videoId,
      moderated: canSeeModeratedVideoFlag,
    });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    let videoUrl = null;
    if (userId) {
      const videoPath = `${video.uploaderId}/${videoId}/video`;
      videoUrl = await getSignedUrl(videoPath);
    }
    res.status(200).json({ message: video, videoUrl: videoUrl });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getThumbnailById = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.body.id;

    // Checking type of user & if it is uploader user then they should be able to see moderated video
    const moderatorTypeFlag = req.body.type === "moderator";
    let canSeeModeratedVideoFlag = moderatorTypeFlag;

    if (!moderatorTypeFlag && userId) {
      const user = await UploaderUser.findOne({ user_id: userId });
      if (user)
        canSeeModeratedVideoFlag = user.uploadedVideos.includes(videoId);
    }
    const video = await Video.findOne({
      video_id: videoId,
      moderated: canSeeModeratedVideoFlag,
    });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const videoPath = `${video.uploaderId}/${videoId}/thumbnail`;
    const thumbnailUrl = await getSignedUrl(videoPath);
    res.status(200).json({ message: video, thumbnailUrl: thumbnailUrl });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createNewVideo = async (req, res) => {
  try {
    const userId = req.body.id;
    const user = await UploaderUser.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: "UploaderUser not found" });
    }
    user.uploadedVideos.push(req.body.videoId);
    await user.save();

    // Optional Parameter
    const tagName = req.body.tagName;
    let tagId = null;
    if (tagName) {
      const tag = await Tag.findOne({ tagName: tagName.toLowerCase() });
      tagId = tag.tagId;
    }
    const newVideo = new Video({
      video_id: req.body.videoId,
      title: req.body.title,
      description: req.body.description,
      uploadDate: new Date(),
      uploaderId: userId,
      tagId: tagId,
    });
    const saveVideo = await newVideo.save();
    res.status(200).json({ message: saveVideo });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateTitleDescription = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    let title = req.body.title;
    let description = req.body.description;
    const userId = req.body.id;
    const user = await UploaderUser.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: "UploaderUser not found" });
    }
    if (!user.uploadedVideos.includes(videoId))
      return res.status(403).json({
        message: "Video not has not been uploaded by user - UNAUTHORIZED",
      });
    const updatedVideo = await Video.findOneAndUpdate(
      { video_id: videoId },
      { title: title, description: description },
      { new: true }
    );
    res.status(200).json({ message: updatedVideo });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.body.id;
    const user = await UploaderUser.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: "UploaderUser not found" });
    }
    if (!user.uploadedVideos.includes(videoId))
      return res.status(403).json({
        message: "Video not has not been uploaded by user - UNAUTHORIZED",
      });

    user.uploadedVideos = user.uploadedVideos.filter(
      (uploaderVideoId) => uploaderVideoId !== videoId
    );

    await user.save();

    const mongoStatus = await Video.deleteOne({ video_id: videoId });

    const videoFolder = `${req.body.id}/${videoId}`;
    const s3Status = await deleteFolderFromS3(videoFolder);

    res.status(200).json({ s3Status: s3Status, mongoStatus: mongoStatus });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getTopVideos = async (req, res) => {
  try {
    const n = parseInt(req.query.n);

    if (isNaN(n) || n <= 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid positive integer for 'n'" });
    }

    const topNVideos = await Video.aggregate([
      { $match: { moderated: false } },
      { $sample: { size: n } },
    ]);

    if (!topNVideos || topNVideos.length === 0) {
      return res.status(404).json({ message: "No top videos found" });
    }

    res.status(200).json({ top_videos: topNVideos });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getVideoWithQuery = async (req, res) => {
  try {
    const searchQuery = req.query.search;

    if (!searchQuery) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    const videos = await Video.find({
      title: { $regex: searchQuery, $options: "i" },
      moderated: { $ne: true },
    });

    if (!videos || videos.length === 0) {
      return res
        .status(404)
        .json({ message: `No videos found with '${searchQuery}' in title` });
    }

    res.status(200).json({ videos: videos });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const likeVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.body.id;

    const video = await Video.findOne({ video_id: videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const user = await ConsumerUser.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({ message: "ConsumerUser not found" });
    }

    if (user.likedVideos.includes(videoId)) {
      return res
        .status(208)
        .json({ message: "Video already liked", video: video });
    }

    const dislikedIndex = user.dislikedVideos.indexOf(videoId);
    if (dislikedIndex !== -1) {
      user.dislikedVideos.splice(dislikedIndex, 1);
      video.dislikes -= 1;
    }

    video.likes += 1;

    user.likedVideos.push(videoId);

    await video.save();
    await user.save();

    res.status(200).json({ message: "Video liked successfully", video: video });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.body.id;
    const video = await Video.findOne({ video_id: videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const user = await ConsumerUser.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: "ConsumerUser not found" });
    }

    if (user.dislikedVideos.includes(videoId)) {
      return res
        .status(208)
        .json({ message: "Video already disliked", video: video });
    }

    const likedIndex = user.likedVideos.indexOf(videoId);
    if (likedIndex !== -1) {
      user.likedVideos.splice(likedIndex, 1);
      video.likes -= 1;
    }
    video.dislikes += 1;

    user.dislikedVideos.push(videoId);

    await video.save();
    await user.save();

    res
      .status(200)
      .json({ message: "Video disliked successfully", video: video });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const addComment = async (req, res) => {
  try {
    const text = req.body.text;
    const videoId = req.params.videoId;
    const userId = req.body.id;
    const commentId = uuidv4();

    const video = await Video.findOne({ video_id: videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const newComment = new Comment({
      commentId: commentId,
      text: text,
      userId: userId,
      videoId: videoId,
      postDate: new Date(),
    });
    await newComment.save();
    res
      .status(200)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getComments = async (req, res) => {
  try {
    const videoId = req.params.videoId;

    const video = await Video.findOne({ video_id: videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const comments = await Comment.find({ videoId: videoId });

    res.status(200).json({ comments: comments });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const moderateVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findOne({ video_id: videoId });

    const userId = req.body.id;
    const user = await ModeratorUser.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: "ModeratorUser not found" });
    }

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    user.moderatedVideos.push(videoId);
    await user.save();

    const moderatedFlag = video.moderated;
    video.moderated = !moderatedFlag;
    await video.save();

    res.status(200).json({
      message: video,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
