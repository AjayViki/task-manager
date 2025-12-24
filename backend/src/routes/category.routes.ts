import { Router } from "express";
import {
  getCategories,
  createCategory,
} from "../controllers/category.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getCategories);
router.post("/", authMiddleware, createCategory);

export default router;
