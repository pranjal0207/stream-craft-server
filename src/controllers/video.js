import Video from "../models/Video.js";
export const getVideoByID = async (req, res) => {
  res.status(200).json({ message: "Get Video By ID" });
};

export const createNewVideo = async (req, res) => {
  // Generate: video_id, uploadDate,
  // Extract from token: uploaderId
  // Default: Views: 0, Likes: 0, dislikes: 0, comments:[], moderated: False
  // const saveVideo = "ye";
  // console.log(req.body);
  const newVideo = new Video({
    video_id: req.body.videoId,
    title: req.body.title,
    description: req.body.description,
    video: `${req.body.videoPath}/video.${req.body.videoExt}`,
    thumbnail: `${req.body.videoPath}/thumbnail.${req.body.thumbnailExt}`,
    uploadDate: new Date(),
    uploaderId: "user123", // TODO: Add here
  });
  const saveVideo = await newVideo.save();
  res.status(200).json({ message: saveVideo });
};

export const updateTitleDescription = async (req, res) => {
  res.status(200).json({ message: "Update Title Description" });
};

export const deleteVideo = async (req, res) => {
  res.status(200).json({ message: "Delete Video" });
};
