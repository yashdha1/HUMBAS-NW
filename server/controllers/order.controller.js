import Product from "../model/product.model.js";
import Order from "../model/order.model.js";
import User from "../model/user.model.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "userId", 
        model: User,
        select: "username phoneNumber address email",  
      })
      .populate({
        path: "products.product",
        model: Product,
        select: "name price",
      });
    console.log("Fetched all orders successfully", orders);
    res.json(orders);
  } catch (error) {
    console.log("Error in getAllOrders controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    // get the status from the frontend :-> 
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ message: "Order ID and status are required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    console.log("Order status updated successfully", order);
    res.json(order);
  } catch (error) {
    console.log("Error in updateOrderStatus controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrdersByStatus  = async (req, res) => {
    try {
        const { status } = req.query;
        if (!status) {
             return res.status(400).json({ message: "Status is required" });
        }
        const orders = await Order.find({ status })
          .populate({
            path: "userId",
            model: User,
            select: "username phoneNumber address email",
          })
          .populate({
            path: "products.product",
            model: Product,
            select: "name price image",
          })
          .sort({ createdAt: -1 });
        console.log("Fetched orders by status successfully", orders);
        res.json(orders);
    } catch (error) {
        console.log("Error in getOrdersByStatus controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;
    
    let query = { userId: userId };
    if (status) {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate({
        path: "products.product",
        model: Product,
        select: "name price image",
      })
      .sort({ createdAt: -1 });
    
    console.log("Fetched user orders successfully", orders);
    res.json(orders);
  } catch (error) {
    console.log("Error in getUserOrders controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

