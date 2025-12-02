import express from "express";
import Product from "../model/product.model.js";
import { redis } from "../lib/redis.js"; 
import cloudinary from "../lib/cloudinary.js";
//helper 
const updateFeaturedProductCache = async  ()=>{
    try {
        const featuredProduct = await Product.find({isFeatured: true}).lean() ;
        await redis.set("featuredProduct" , JSON.stringify(featuredProduct));
    } catch (error) {
        console.log("Error in updating the cache: ", error);
    }
}

// endpoinds controllers : 
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).select("-__v"); //  find all the products in the Object...
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error in getProducts CONTROLLER:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};
export const getfeaturedProducts = async (req, res) => {  
  try {
    let featuredProducts = await redis.get("featuredProducts"); // get the featured products from the Redis DB
    if (featuredProducts) {
      return res.json({ success: true, products: JSON.parse(featuredProducts) });
    }
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts || featuredProducts.length === 0) {
      return res.json({ success: true, products: [] });
    }
    // store in redis : for faster later access:
    await redis.set("featuredProducts", JSON.stringify(featuredProducts), "EX", 3600); // Cache for 1 hour
    return res.json({ success: true, products: featuredProducts });
  } catch (error) {
    console.error("Error in getfeaturedProducts CONTROLLER:", error.message);
    // Fallback to database if Redis fails
    try {
      const featuredProducts = await Product.find({ isFeatured: true }).lean();
      return res.json({ success: true, products: featuredProducts || [] });
    } catch (dbError) {
      return res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? dbError.message : "Internal server error" });
    }
  }
};
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image, metric } = req.body;
    if (!name || !price || !description || !category || !image || !metric) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Validate price is a number
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ success: false, message: "Price must be a positive number." });
    }

    // Getting the images :
    let cloudinaryResponse;
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError.message);
      return res
        .status(500)
        .json({ success: false, message: "Image upload failed", error: process.env.NODE_ENV === "development" ? uploadError.message : undefined });
    }

    const newProduct = await Product.create({
      name,
      price,
      description,
      category,
      image: cloudinaryResponse.secure_url || "",
      metric,
    });
    
    res.status(201).json({
      success: true,
      product: newProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error in createProduct CONTROLLER:", error.message);
    return res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error" });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params._id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // also delete the product from the ID :=>
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // gets the ID of the current image :
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.error("Image deletion from Cloudinary failed:", error.message);
        // Continue with product deletion even if image deletion fails
      }
    }
    await Product.findByIdAndDelete(req.params._id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct CONTROLLER:", error.message);
    return res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error" });
  }
};
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
          category: 1,
          metric: 1,
        },
      },
    ]); //  getting Random 3 products :

    // return 3 random products :: 
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error in getRecommendedProducts CONTROLLER:", error.message);
    res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error" });
  }
};
export const getProductsByCategory = async (req, res) => {
    try {
        const {category} = req.params;

        // find the products with the category. 
        const products = await Product.find({category});
        res.json({products});
    } catch (error) {
        console.error("Error in getProductsByCategory CONTROLLER:", error.message);
        res.status(500).json({success: false, error: error.message});   
    }
};
export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params._id); 
        if(product) {
           product.isFeatured  = !product.isFeatured; // toggle ~ on and off ~
           const updatedProduct = await product.save(); 
           await updateFeaturedProductCache(); 
           res.json({success: true, product: updatedProduct});
        }else{
            res.status(404).json({success: false, message: "Product not found"});
        }
    } catch (error) {
        console.error("Error in toggleFeaturedProduct CONTROLLER:", error.message);
        res.status(500).json({success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error"});
    }
};