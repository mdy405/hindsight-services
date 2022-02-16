import { Router } from "express";
import { login } from "../services/login.js";
const router = Router();

router.post("/login", login);

export default router;
