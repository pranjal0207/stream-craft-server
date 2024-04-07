import express, { Router }  from "express";
import { getVideoByID, createNewVideo, updateTitleDescription, deleteVideo } from "../controllers/video.js";

const router = express.Router();

router.get("/:video_id", getVideoByID); 
router.post("/newVideo", createNewVideo);
router.put("/:videoId", updateTitleDescription);
router.delete("/:video_id", deleteVideo);

export default router;