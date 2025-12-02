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
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in getAllOrders controller:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    // Only admins can update order status (except users can cancel their own orders)
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ 
        success: false,
        message: "Order ID and status are required" 
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }

    // Users can only cancel their own orders
    if (status === "cancelled" && req.user.role === "user") {
      if (order.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          success: false,
          message: "You can only cancel your own orders" 
        });
      }
    } else if (req.user.role !== "admin") {
      // Only admins can set other statuses
      return res.status(403).json({ 
        success: false,
        message: "Admin access required to update order status" 
      });
    }

    // Validate status values
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      });
    }

    order.status = status;
    await order.save();

    res.json({ 
      success: true,
      order 
    });
  } catch (error) {
    console.error("Error in updateOrderStatus controller:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
};

export const getOrdersByStatus  = async (req, res) => {
    try {
        const { status } = req.query;
        if (!status) {
             return res.status(400).json({ success: false, message: "Status is required" });
        }
        
        // Validate status
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
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
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error in getOrdersByStatus controller:", error.message);
        res.status(500).json({ success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? error.message : undefined });
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
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in getUserOrders controller:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

