import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user, // ✅ NOW WORKS
  });
});

export default router;
