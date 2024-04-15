import User from "../models/User.js";
import Video from "../models/Video.js";
import { deleteFolderFromS3 } from "../services/s3/delete.js";
import { getSignedUrl } from "../services/s3/get.js";

export const getVideoByID = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findOne({ video_id: videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const videoPath = `${req.body.id}/${videoId}/video`;
    const videoUrl = await getSignedUrl(videoPath);
    res.status(200).json({ message: video, videoUrl: videoUrl });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getThumbnailById = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const video = await Video.findOne({ video_id: videoId });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const videoPath = `${req.body.id}/${videoId}/thumbnail`;
    const thumbnailUrl = await getSignedUrl(videoPath);
    res.status(200).json({ message: video, thumbnailUrl: thumbnailUrl });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const createNewVideo = async (req, res) => {
  // Extract from token: uploaderId
  try {
    const newVideo = new Video({
      video_id: req.body.videoId,
      title: req.body.title,
      description: req.body.description,
      // video: `${req.body.videoPath}/video.${req.body.videoExt}`,
      // thumbnail: `${req.body.videoPath}/thumbnail.${req.body.thumbnailExt}`,
      uploadDate: new Date(),
      uploaderId: req.body.id,
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

    const topNVideos = await Video.aggregate([{ $sample: { size: n } }]);

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

    const user = await User.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    console.log(error);
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

    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    console.log(error);
    res.status(500).json({ error: error });
  }
};
