import express, { Router } from "express";
import {
  getVideoByID,
  getThumbnailById,
  createNewVideo,
  updateTitleDescription,
  deleteVideo,
  getTopVideos,
} from "../controllers/video.js";
import { handleUploadMiddleware } from "../services/s3/upload.js";
import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

// Video routes
router.get("/getVideo/:videoId", verifyToken, getVideoByID);
router.get("/getThumbnail/:videoId", verifyToken, getThumbnailById);
router.post("/newVideo", verifyToken, handleUploadMiddleware, createNewVideo);
router.put("/:videoId", verifyToken, updateTitleDescription);
router.delete("/:videoId", verifyToken, deleteVideo);

// Interaction routes
router.get("/getTopVideos", verifyToken, getTopVideos);

export default router;
