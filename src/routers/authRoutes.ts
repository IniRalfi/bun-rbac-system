// src/routers/authRoutes.ts
import { Router } from "express";
import { loginPage, loginProcess, logout } from "../controllers/authController";

const router = Router();

router.get("/login", loginPage);
router.post("/login", loginProcess);
router.get("/logout", logout);

export default router;
