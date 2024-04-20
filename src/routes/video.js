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
router.get("/getVideo/:videoId", verifyTokenWithContinue, getVideoByID); // Accessed by all, otp. token for video URL
router.get("/getThumbnail/:videoId", verifyTokenWithContinue, getThumbnailById); // Accessed by all, opt. token for moderated
router.post("/newVideo", verifyToken, handleUploadMiddleware, createNewVideo); // Accessed by uploader
router.put("/:videoId", verifyToken, updateTitleDescription); // Accessed by uploader
router.delete("/:videoId", verifyToken, deleteVideo); // Accessed by uploader

// Interaction routes
router.get("/getTopVideos", getTopVideos); // Accessed by all
router.get("/", getVideoWithQuery); // Accessed by all
router.put("/:videoId/like", verifyToken, likeVideo); // Accessed by consumer
router.put("/:videoId/dislike", verifyToken, dislikeVideo); // Accessed by consumer
router.post("/:videoId/comment", verifyToken, addComment); // Accessed by consumer
router.get("/:videoId/comment", verifyToken, getComments); // Accessed by authorized user
router.put("/:videoId/moderate", verifyToken, moderateVideo); // Accessed by moderator
export default router;
