import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

// Endpoints :
export const signup = async (req, res) => {
  try {
    const { username, email, password, address, phoneNumber } = req.body;
    if (!username || !email || !password || !address || !phoneNumber) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] }); // check if user already exists!!
    if (userExists) {
      return res.status(400).json({ success: false, message: "User with this email or username already exists!" });
    }
    
    const newUser = await User.create({ username, email, password, address, phoneNumber });

    // Authentication :
    const { accessToken, refreshToken } = generateTokens(newUser._id); // after user is created :
    await storeTokens(newUser._id, refreshToken); // storing Tokens in redis Database :
    setCookies(res, accessToken, refreshToken); // setup cookies So we can access it later...

    // Don't send password in response
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      address: newUser.address,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return res
      .status(201)
      .json({ success: true, user: userResponse, message: "User created successfully" });
  } catch (error) {
    console.error("Error in SIGNUP CONTROLLER:", error.message);
    return res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    
    const user = await User.findOne({ email }); // find user in the DATABASE :

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id); // after user is created :
      await storeTokens(user._id, refreshToken); // storing Tokens in redis Database :
      setCookies(res, accessToken, refreshToken); // setup cookies So we can access it later...

      // Don't send password in response
      const userResponse = {
        _id: user._id,
        username: user.username,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
        role: user.role,
        createdAt: user.createdAt,
      };

      res.json({ success: true, user: userResponse, message: "User logged in successfully" });
    } else {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in LOGIN CONTROLLER:", error.message);
    return res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error" });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // collect this token from cookies.
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        await redis.del(`Refresh Token: ${decoded.userId}`); // delete the current instance
      } catch (error) {
        // Token might be expired, continue with logout anyway
        console.error("Error verifying refresh token during logout:", error.message);
      }
    }

    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      ...(isProduction && { domain: process.env.COOKIE_DOMAIN }),
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      ...(isProduction && { domain: process.env.COOKIE_DOMAIN }),
    });

    res.json({ success: true, message: "User logged out successfully." });
  } catch (error) {
    console.error("Error in logout CONTROLLER:", error.message);
    res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error" });
  }
};
export const refreshTokens = async (req, res) => {
  // refreshToken : refreshes the access token so that the user can access the account, even after the timeout.
  // or the previous cookie has expiered :
  try {
    const refreshToken = req.cookies.refreshToken; // Get the refresh token from cookies
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token found. Please login again." });
    }
    
    if (!process.env.JWT_REFRESH_SECRET) {
      return res.status(500).json({ success: false, message: "Server configuration error" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const getStoredToken = await redis.get(`Refresh Token: ${decoded.userId}`);

    if (getStoredToken !== refreshToken) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized: Invalid refresh token" });
    }

    // else generate the new refresh TOKEN...
    // Generate a new access token
    const refreshedAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIREIN }
    );
    // Set the new access token in cookies
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", refreshedAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
      ...(isProduction && { domain: process.env.COOKIE_DOMAIN }),
    });

    return res.json({ success: true, message: "Token refreshed successfully." });
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      // Clear cookies if token is invalid
      const isProduction = process.env.NODE_ENV === "production";
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};
export const getProfile = async (req, res) => {
  try {
    // Don't send password in response
    const userResponse = {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      address: req.user.address,
      phoneNumber: req.user.phoneNumber,
      role: req.user.role,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };
    res.json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Error in getProfile CONTROLLER:", error.message);
    res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    // Aggregate users with their order stats and recent order history
    const usersWithStats = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "ordersInfo",
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$ordersInfo" },
          totalAmountSpent: { $sum: "$ordersInfo.totalAmount" },
          recentOrders: {
            $slice: [
              {
                $map: {
                  input: { $slice: ["$ordersInfo", 5] }, // first 5 (we'll sort in a separate stage if needed)
                  as: "ord",
                  in: {
                    _id: "$$ord._id",
                    totalAmount: "$$ord.totalAmount",
                    status: "$$ord.status",
                    createdAt: "$$ord.createdAt",
                  },
                },
              },
              5,
            ],
          },
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          phoneNumber: 1,
          address: 1,
          role: 1,
          totalOrders: 1,
          totalAmountSpent: 1,
          recentOrders: 1,
          createdAt: 1,
          // Explicitly exclude password
          password: 0,
        },
      },
    ]);

    res.json({ success: true, users: usersWithStats });
  } catch (error) {
    console.error("Error in getAllUsers Controller:", error.message);
    res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error" });
  }
};

// to update the profile of the User:-> 
export const updateProfile = async (req, res) => {
  try {
    const { username, email, address, phoneNumber } = req.body;
    if (!username || !email || !address || !phoneNumber) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    // Check if email or username is already taken by another user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: req.user._id }
    });
    
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email or username already taken." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, address, phoneNumber },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ success: true, user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error in updateProfile CONTROLLER:", error.message);
    res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error" });
  }
};

// Helpers :-> 
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIREIN,
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIREIN,
  });

  return { accessToken, refreshToken };
};
const storeTokens = async (userId, refreshToken) => {
  // Redis EX expects seconds, not milliseconds
  await redis.set(
    `Refresh Token: ${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 // 7 days in seconds
  );
};
const setCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", // "none" for cross-origin in production
    maxAge: 15 * 60 * 1000,
    ...(isProduction && { domain: process.env.COOKIE_DOMAIN }),
  });

  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax", // "none" for cross-origin in production
    maxAge: 7 * 24 * 60 * 60 * 1000,
    ...(isProduction && { domain: process.env.COOKIE_DOMAIN }),
  });
};
