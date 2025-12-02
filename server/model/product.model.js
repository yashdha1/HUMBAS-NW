import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Please provide an image"],
    },
    category: {
      type: String,
      required: true,
      enum: ["others", "dairy", "vegetables", "fruits"],
    },
    metric: {
      type: String,
      required: true,
      enum: ["weight", "quantity"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
