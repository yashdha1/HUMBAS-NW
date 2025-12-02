import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// function makes sure we have a valid access token and that the user is an admin
export const protectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No access token found" });
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      return res
        .status(500)
        .json({ success: false, message: "Server configuration error" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired. Please refresh your token." 
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: Invalid token" 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: "Unauthorized: Authentication failed" 
    });
  }
};
export const adminRoute = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ 
      success: false, 
      message: "Forbidden: Admin access required" 
    });
  }
  next();
};
