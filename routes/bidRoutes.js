import express from "express";
import vendorAuth from "../middleware/vendorAuth.js";
import {
  createBid,
  getMyBids,
  updateBid,
  deleteBid,
} from "../controllers/bidController.js";

const router = express.Router();

router.post("/", vendorAuth, createBid);       // Place bid
router.get("/my", vendorAuth, getMyBids);      // Vendor bids
router.put("/:id", vendorAuth, updateBid);    // Update bid
router.delete("/:id", vendorAuth, deleteBid); // Delete bid

export default router;
