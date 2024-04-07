import express, { Router }  from "express";
import { getUserById, updateEmailPassword } from "../controllers/user.js";

const router = express.Router();

router.get("/:user_id", getUserById);
router.put("/:user_id", updateEmailPassword);

export default router;