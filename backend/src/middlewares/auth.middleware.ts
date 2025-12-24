import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
