import express, { Router } from "express";
import {
  getVideoByID,
  getThumbnailById,
  createNewVideo,
  updateTitleDescription,
  deleteVideo,
} from "../controllers/video.js";
import { handleUploadMiddleware } from "../services/s3/upload.js";
const router = express.Router();

router.get("/getVideo/:videoId", getVideoByID);
router.get("/getThumbnail/:videoId", getThumbnailById);
router.post("/newVideo", handleUploadMiddleware, createNewVideo);
router.put("/:videoId", updateTitleDescription);
router.delete("/:videoId", deleteVideo);

export default router;
