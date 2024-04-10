import express, { Router } from "express";
import {
  getVideoByID,
  createNewVideo,
  updateTitleDescription,
  deleteVideo,
} from "../controllers/video.js";
import { handleUploadMiddleware } from "../services/s3/upload.js";
const router = express.Router();

router.get("/:videoId", getVideoByID);
router.post("/newVideo", handleUploadMiddleware, createNewVideo);
router.put("/:videoId", updateTitleDescription);
router.delete("/:videoId", deleteVideo);

export default router;
