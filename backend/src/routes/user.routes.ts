import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, (req: Request, res: Response) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;
