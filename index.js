// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import sequelize from "./db.js";

import userRoutes from "./routes/userRoutes.js"
import vendorRoutes from "./routes/vendorRoutes.js"
import bidRoutes from "./routes/bidRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import requirementRoutes from "./routes/requirementRoutes.js";
import vendorProfileRoutes from "./routes/vendorProfileRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
  res.send("Event Backend API (Sequelize) is running...");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/vendor/profile", vendorProfileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
// Sync database and start server
sequelize
  .sync()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database sync failed:", err.message);
  });