import express from "express";
import vendorAuth from "../middleware/vendorAuth.js";
import {
  createBid,
  getMyBids,
  updateBid,
  deleteBid,
  getAllBids,
  getPendingBids,
  getApprovedBids
} from "../controllers/bidController.js";

const router = express.Router();

router.post("/", vendorAuth, createBid);       // Place bid
router.get("/my", vendorAuth, getMyBids);      // Vendor bids
router.put("/:id", vendorAuth, updateBid);    // Update bid
router.delete("/:id", vendorAuth, deleteBid); // Delete bid

// Admin / System
router.get("/", getAllBids);           // GET ALL
router.get("/pending", getPendingBids);
router.get("/approved", getApprovedBids);

export default router;
