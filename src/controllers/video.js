import Video from "../models/Video.js";
export const getVideoByID = async (req, res) => {
  try {
    const id = req.params.videoId;
    const video = await Video.findOne({ video_id: id });
    res.status(200).json({ message: video });
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
      video: `${req.body.videoPath}/video.${req.body.videoExt}`,
      thumbnail: `${req.body.videoPath}/thumbnail.${req.body.thumbnailExt}`,
      uploadDate: new Date(),
      uploaderId: "user123", // TODO: Add user token here
    });
    const saveVideo = await newVideo.save();
    res.status(200).json({ message: saveVideo });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateTitleDescription = async (req, res) => {
  try {
    const id = req.params.videoId;
    let title = req.body.title;
    let description = req.body.description;
    console.log(id);
    const updatedVideo = await Video.findOneAndUpdate(
      { video_id: id },
      { title: title, description: description },
      { new: true }
    );
    res.status(200).json({ message: updatedVideo });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteVideo = async (req, res) => {
  res.status(200).json({ message: "Delete Video" });
};
