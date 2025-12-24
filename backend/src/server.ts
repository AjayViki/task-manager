import app from "./app";
import { connectDB } from "./config/db";

const PORT = 5000;

const startServer = async () => {
  await connectDB(); // 🔥 DB CONNECTS HERE

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
