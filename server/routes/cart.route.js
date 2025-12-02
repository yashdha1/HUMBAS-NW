import express from "express";
import {
  addToCart,
  removeAllFromCart,
  updateQuantity, 
  getAllProducts, 
  createOrder
} from "../controllers/cart.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/" , protectedRoute , getAllProducts); // for the admin 
router.post("/", protectedRoute, addToCart);    // for the user
router.delete("/", protectedRoute, removeAllFromCart);
router.put("/", protectedRoute, updateQuantity);

// delete everything in the cart and create an ORDER:-> 
router.post("/createOrder", protectedRoute, createOrder); 
 

export default router;
  