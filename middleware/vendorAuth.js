// middleware/vendorAuth.js
import jwt from "jsonwebtoken";

const vendorAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

    req.vendorId = decoded.id; // 🔥 logged-in vendor id
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default vendorAuth;
