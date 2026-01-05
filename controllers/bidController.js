import Bid from "../models/bid.js";


/* =========================
   CREATE BID (Vendor)
========================= */
export const createBid = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    const { requirementId, amount } = req.body;

    if (!requirementId || !amount) {
      return res.status(400).json({ message: "Requirement and amount are required" });
    }

    const bid = await Bid.create({
      vendorId,
      requirementId,
      amount,
      status: "Pending",
    });

    res.status(201).json({
      message: "Bid placed successfully",
      bid,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET MY BIDS (Vendor)
========================= */
export const getMyBids = async (req, res) => {
  try {
    const vendorId = req.vendorId;

    const bids = await Bid.findAll({
      where: { vendorId },
      order: [["createdAt", "DESC"]],
    });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE BID (Vendor)
========================= */
export const updateBid = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    const bidId = req.params.id;
    const { amount } = req.body;

    const bid = await Bid.findOne({
      where: { id: bidId, vendorId },
    });

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    if (bid.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending bids can be updated",
      });
    }

    bid.amount = amount;
    await bid.save();

    res.json({
      message: "Bid updated successfully",
      bid,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE BID (Vendor)
========================= */
export const deleteBid = async (req, res) => {
  try {
    const vendorId = req.vendorId;
    const bidId = req.params.id;

    const bid = await Bid.findOne({
      where: { id: bidId, vendorId },
    });

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    if (bid.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending bids can be deleted",
      });
    }

    await bid.destroy();

    res.json({ message: "Bid deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET ALL BIDS (Admin)
========================= */
export const getAllBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: bids.length,
      bids,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================
   GET PENDING BIDS
========================= */
export const getPendingBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { status: "Pending" },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: bids.length,
      bids,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* =========================
   GET APPROVED BIDS
========================= */
export const getApprovedBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { status: "Approved" },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      total: bids.length,
      bids,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


