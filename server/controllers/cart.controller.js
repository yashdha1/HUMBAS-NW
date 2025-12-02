import Product from "../model/product.model.js";
import Order from "../model/order.model.js";
import User from "../model/user.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const cartItems = req.user.cartItems || [];
    const productIds = cartItems
      .map((item) => item.product || item._id)
      .filter((id) => id != null);
    
    if (productIds.length === 0) {
      return res.json([]);
    }
    
    const products = await Product.find({ _id: { $in: productIds } });
    const cartDetails = cartItems
      .map((cartItem) => {
        const productId = cartItem.product || cartItem._id;
        const product = products.find(
          (prod) => prod._id.toString() === productId.toString()
        );
        if (!product) return null;

        return {
          ...product.toObject(),
          quantity: cartItem.quantity || 1,
        };
      })
      .filter((item) => !!item);

    // 4. Respond with the merged data
    return res.json({ success: true, cart: cartDetails });
  } catch (error) {
    console.error("Error in getAllProducts controller:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const user = req.user;
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const existingItem = user.cartItems.find(
      (item) => item.product && item.product.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += 1; // if the user already has the product then +1
    } else {
      user.cartItems.push({
        product: productId,
        quantity: 1,
      });
    }

    await user.save();
    res.json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    console.error("Error in addToCart controller:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: process.env.NODE_ENV === "development" ? error.message : undefined });
  }
};
export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(
        (item) => item.product && item.product.toString() !== productId
      );
    }

    await user.save(); // save the user back to DB:
    res.json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    console.error("Error in removeAllFromCart CONTROLLER:", error.message);
    res.status(500).json({ success: false, error: process.env.NODE_ENV === "development" ? error.message : "Internal server error" });
  }
};

// export const updateQuantity = async (req, res) => {
//   try {
//     const { quantity, productId } = req.body;
//     const user = req.user;

//     // Use .find() to locate the item in the array by its ID
//     const existingItem = user.cartItems.find(
//       (item) => item.productId && item.productId.toString() === productId
//     );

//     if (existingItem) {
//       if (quantity === 0) {
//         // Correctly remove the item if quantity is 0
//         user.cartItems = user.cartItems.filter(
//           (item) => item.productId && item.productId.toString() !== productId
//         );
//         await user.save();
//         return res.json(user.cartItems);
//       }

//       existingItem.quantity = quantity;
//       await user.save();
//       return res.json(user.cartItems);
//     } else {
//       res.status(404).json({ message: "Product not found in cart" });
//     }
//   } catch (error) {
//     console.error("Error in updateQuantity controller:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
export const updateQuantity = async (req, res) => {
  try {
    const { quantity, productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    if (!quantity || quantity < 0) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }

    const user = req.user;
    // Use .find() to locate the item in the array by its product ID
    const existingItem = user.cartItems.find(
      (item) => {
        const itemProductId = item.product ? item.product.toString() : (item._id ? item._id.toString() : null);
        return itemProductId === productId.toString();
      }
    );

    if (existingItem) {
      if (quantity === 0) {
        // Correctly remove the item if quantity is 0
        user.cartItems = user.cartItems.filter(
          (item) => {
            const itemProductId = item.product ? item.product.toString() : (item._id ? item._id.toString() : null);
            return itemProductId !== productId.toString();
          }
        );
        await user.save();
        
        // Return full cart details
        const productIds = user.cartItems.map((item) => item.product || item._id).filter((id) => id != null);
        if (productIds.length === 0) {
          return res.json([]);
        }
        const products = await Product.find({ _id: { $in: productIds } });
        const cartDetails = user.cartItems
          .map((cartItem) => {
            const productId = cartItem.product || cartItem._id;
            const product = products.find(
              (prod) => prod._id.toString() === productId.toString()
            );
            if (!product) return null;
            return {
              ...product.toObject(),
              quantity: cartItem.quantity || 1,
            };
          })
          .filter((item) => !!item);
        return res.json(cartDetails);
      }

      existingItem.quantity = quantity;
      await user.save();
      
      // Return full cart details
      const productIds = user.cartItems.map((item) => item.product || item._id).filter((id) => id != null);
      if (productIds.length === 0) {
        return res.json([]);
      }
      const products = await Product.find({ _id: { $in: productIds } });
      const cartDetails = user.cartItems
        .map((cartItem) => {
          const productId = cartItem.product || cartItem._id;
          const product = products.find(
            (prod) => prod._id.toString() === productId.toString()
          );
          if (!product) return null;
          return {
            ...product.toObject(),
            quantity: cartItem.quantity || 1,
          };
        })
        .filter((item) => !!item);
      return res.json({ success: true, cart: cartDetails });
    } else {
      return res.status(404).json({ 
        success: false,
        message: "Product not found in cart. Please refresh and try again."
      });
    }
  } catch (error) {
    console.error("Error in updateQuantity controller:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Server error while updating quantity", 
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// technically this should be in the ORder manager:-> but fuck it
// this will create a new order for the user and empty the cartItems array :
export const createOrder = async (req, res) => {
  try {
    // 1. add in the Orders of the USER
    const user = req.user;
    
    if (!user.cartItems || user.cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Calculate total amount
    const productIds = user.cartItems
      .map((item) => {
        if (item.product) {
          return item.product.toString();
        }
        return item._id ? item._id.toString() : null;
      })
      .filter((id) => id != null);
    
    if (productIds.length === 0) {
      return res.status(400).json({ success: false, message: "No valid products found in cart" });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length === 0) {
      return res.status(400).json({ success: false, message: "Products not found in database. Please refresh your cart." });
    }
    
    let totalAmount = 0;
    const orderProducts = [];
    
    for (const cartItem of user.cartItems) {
      const productId = cartItem.product ? cartItem.product.toString() : (cartItem._id ? cartItem._id.toString() : null);
      if (!productId) continue;
      
      const product = products.find(
        (p) => p._id.toString() === productId
      );
      
      if (!product) {
        continue;
      }
      
      const price = product.price;
      const quantity = cartItem.quantity || 1;
      totalAmount += price * quantity;
      
      orderProducts.push({
        product: product._id,
        quantity: quantity,
        price: price,
      });
    }

    if (orderProducts.length === 0) {
      return res.status(400).json({ success: false, message: "No valid products found to create order" });
    }

    const order = await Order.create({
      userId: user._id,
      products: orderProducts,
      status: "pending", // lowercase to match model enum
      totalAmount: totalAmount,
    });
    
    await emptyCart(user);
    
    if (!user.orders) {
      user.orders = [];
    }
    user.orders.push({ orderId: order._id.toString() });
    
    await user.save();
    
    // Populate the order before returning
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: "products.product",
        model: Product,
        select: "name price image",
      });
    
    return res.status(201).json({ success: true, order: populatedOrder || order });
  } catch (error) {
    console.error("Error in createOrder controller:", error.message);
    res.status(500).json({ 
      success: false,
      message: "Server error while creating order", 
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
const emptyCart = async (user) => {
  try {
    user.cartItems = [];
    await user.save();
  } catch (error) {
    console.log("Error in emptyCart function", error.message);
  }
};
