import express, { Router } from "express";
import { getUserById, updateEmailPassword } from "../controllers/user.js";
import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

router.get("/:type/:user_id", getUserById);
router.put("/:type/:user_id", verifyToken, updateEmailPassword);

export default router;
