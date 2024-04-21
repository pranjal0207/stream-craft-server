import express, { Router } from "express";
import {
  getUserById,
  updateEmailPassword,
  getUploaderVideos,
  getWatchedVideos,
  getModeratedVideos,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

router.get("/getUploaderVideos/:userId", verifyToken, getUploaderVideos);
router.get("/getWatchedVideos/:userId", verifyToken, getWatchedVideos);
router.get("/getModeratedVideos/:userId", verifyToken, getModeratedVideos);
router.get("/:type/:user_id", getUserById);
router.put("/:type/:user_id", verifyToken, updateEmailPassword);

export default router;
