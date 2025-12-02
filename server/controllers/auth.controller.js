import User from "../model/user.model.js";
import Order from "../model/order.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

// Endpoints :
export const signup = async (req, res) => {
  try {
    const { username, email, password, address, phoneNumber } = req.body;
    if (!username || !email || !password || !address || !phoneNumber)
      return res.status(400).send("All fields are required.");

    const userExists = await User.findOne({ email }); // cheack if user already exists!!
    if (userExists) {
      return res.status(400).send("User already exists!");
    }
    // create a new User in the DB.w

    // OTP VERIFICATION OF THE USER:-> 
    const OTP = Math.floor(1000 + Math.random() * 9000); // generate OTP :
    
    const newUser = await User.create({ username, email, password , address, phoneNumber});

    // Authentication :
    const { accessToken, refreshToken } = generateTokens(newUser._id); // after user is created :
    await storeTokens(newUser._id, refreshToken); // storing Tokens in redis Database :
    setCookies(res, accessToken, refreshToken); // setup cookies So we can access it later...
    console.log("Setting Cookies: ", { accessToken, refreshToken });

    return res
      .status(201)
      .json({ user: newUser, message: "User created successfully" });
  } catch (error) {
    console.log("Error in SIGNUP CONTROLLER");
    return res.status(500).json({ error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send("All fields are required.");
    const user = await User.findOne({ email }); // find user in the DATABASE :


    if (user && (await user.comparePassword(password))) {
      // console.log(user); 
      const { accessToken, refreshToken } = generateTokens(user._id); // after user is created :
      await storeTokens(user._id, refreshToken); // storing Tokens in redis Database :
      // console.log("Setting Cookies: ", { accessToken, refreshToken });
      setCookies(res, accessToken, refreshToken); // setup cookies So we can access it later...
      // console.log("Setting Cookies: ", { accessToken, refreshToken });

      res.json({ user, message: "User logged in successfully" }); // send user as the respose:
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Error in LOGIN CONTROLLER");
    return res.status(500).json({ error: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken; // collect this token from cookies.
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      await redis.del(`Refresh Token: ${decoded.userId}`); // delete the current instance for this shit...
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({ message: "User logged out Automatically." });
  } catch (error) {
    console.log("Error in logout CONTROLLER");
    res.status(500).json({ error: error.message });
  }
};
export const refreshTokens = async (req, res) => {
  // refreshToken : refreshes the access token so that the user can access the account, even after the timeout.
  // or the previous cookie has expiered :
  try {
    const refreshToken = req.cookies.refreshToken; // Get the refresh token from cookies
    if (!refreshToken) {
      return res.json({ message: "User logged out successfully" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // debugg :
    console.log("Refresh Token from Cookie:", refreshToken);
    const getStoredToken = await redis.get(`Refresh Token: ${decoded.userId}`);
    console.log("Stored Refresh Token in Redis:", getStoredToken);

    if (getStoredToken !== refreshToken) {
      console.log("Token mismatch! Unauthorized access.");
      return res
        .status(401)
        .json({ error: " Unauthorized: Invalid refresh token... " });
    }

    // else generate the new refresh TOKEN...
    // Generate a new access token
    const refreshedAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIREIN }
    );
    // Set the new access token in cookies
    res.cookie("accessToken", refreshedAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: "Token refreshed successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server ERROR. LOGOUT AND TRY AGAIN." });
  }
};
export const getProfile = async (req, res) => {
  try {
    res.json({ user: req.user }); // directly user is in the req body:
  } catch (error) {
    console.log("Error in getProfile CONTROLLER");
    res.status(500).json({ error: error.message });
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
        },
      },
    ]);

    res.json(usersWithStats);
  } catch (error) {
    console.log("Error in get ALl Users Controller:->");
    res.status(500).json({ error: error.message });
  }
};

// to update the profile of the User:-> 
export const updateProfile = async (req, res) => {
  try {
    const { username, email, address, phoneNumber } = req.body;
    if (!username || !email || !address || !phoneNumber)
      return res.status(400).send("All fields are required.");

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email, address, phoneNumber },
      { new: true }
    );

    res.json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.log("Error in updateProfile CONTROLLER");
    res.status(500).json({ error: error.message });
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
  await redis.set(
    `Refresh Token: ${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 * 1000
  );
};
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  
    sameSite: "lax", 
    maxAge: 15 * 60 * 1000,  
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  console.log("fuck Cookies Set:", {
    accessToken,
    refreshToken,
  });
};
