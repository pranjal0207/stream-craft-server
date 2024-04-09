import express, { Router }  from "express";
import { getUserById, updateEmailPassword } from "../controllers/user.js";
import { verifyToken } from "../middleware/autherisation.js";

const router = express.Router();

router.get("/:user_id", verifyToken, getUserById);
router.put("/:user_id", verifyToken, updateEmailPassword);

export default router;