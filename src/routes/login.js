import express, { Router }  from "express";
import { login, createNewUser } from "../controllers/login.js";

const router = express.Router();

router.post("/:type", login);
router.post("/:type/register", createNewUser)

export default router;