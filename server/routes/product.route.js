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

// Route should be protected and only be accesible via ADMIN...
router.get("/", protectedRoute, adminRoute, getProducts); 
router.get("/category/:category", getProductsByCategory); // for everyone on the homepage of the website:-> 
router.post("/", protectedRoute, adminRoute, createProduct);
router.delete("/:_id", protectedRoute, adminRoute, deleteProduct);


export default router;