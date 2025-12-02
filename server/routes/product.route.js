import express from "express";
import {
  getProducts,
  getfeaturedProducts,
  createProduct,
  deleteProduct,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct
} from "../controllers/product.controller.js";
import { protectedRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/category/:category", getProductsByCategory); // for everyone on the homepage of the website:-> 
router.get("/recommended", getRecommendedProducts); // Get recommended products (public)
router.get("/featured", getfeaturedProducts); // Get featured products (public)

// Protected admin routes
router.get("/", protectedRoute, adminRoute, getProducts); 
router.post("/", protectedRoute, adminRoute, createProduct);
router.delete("/:_id", protectedRoute, adminRoute, deleteProduct);
router.put("/:_id/featured", protectedRoute, adminRoute, toggleFeaturedProduct);


export default router;