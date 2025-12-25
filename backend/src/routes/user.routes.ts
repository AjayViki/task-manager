import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  changePassword,
  getProfile,
  updateProfile,
} from "../controllers/users.controller";

const router = Router();

// router.get("/me", authMiddleware, (req, res) => {
//   res.json({
//     message: "Protected route accessed",
//     user: req.user, // ✅ NOW WORKS
//   });
// });
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;
