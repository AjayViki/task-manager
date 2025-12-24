import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // frontend
    credentials: true, // 🔴 IMPORTANT
  })
);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/tasks", taskRoutes);

export default app;
