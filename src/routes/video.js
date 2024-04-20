import express, { Router } from "express";
import {
  getVideoByID,
  getThumbnailById,
  createNewVideo,
  updateTitleDescription,
  deleteVideo,
  getTopVideos,
  getVideoWithQuery,
  likeVideo,
  dislikeVideo,
  addComment,
  getComments,
  moderateVideo,
} from "../controllers/video.js";
import { handleUploadMiddleware } from "../services/s3/upload.js";
import {
  verifyToken,
  verifyTokenWithContinue,
} from "../middleware/authentication.js";

const router = express.Router();

// Video routes
router.get("/getVideo/:videoId", verifyTokenWithContinue, getVideoByID);
router.get("/getThumbnail/:videoId", getThumbnailById);
router.post("/newVideo", verifyToken, handleUploadMiddleware, createNewVideo);
router.put("/:videoId", verifyToken, updateTitleDescription);
router.delete("/:videoId", verifyToken, deleteVideo);

// Interaction routes
router.get("/getTopVideos", getTopVideos);
router.get("/", getVideoWithQuery);
router.put("/:videoId/like", verifyToken, likeVideo);
router.put("/:videoId/dislike", verifyToken, dislikeVideo);
router.post("/:videoId/comment", verifyToken, addComment);
router.get("/:videoId/comment", verifyToken, getComments);
router.put("/:videoId/moderate", verifyToken, moderateVideo);

export default router;
