import express from "express";
import { registerUser, loginUser, getAllUsers } from "../controllers/userController.js";
// import { protectUser } from "../middleware/userMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);   // 🔹 GET ALL USERS
export default router;