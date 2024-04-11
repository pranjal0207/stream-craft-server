import express, { Router }  from "express";
import { login, createNewUser } from "../controllers/login.js";

const router = express.Router();

router.post("/", login);
router.post("/register", createNewUser)

export default router;