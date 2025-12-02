import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  total: 0,
  subtotal: 0,

  getCartItems: async ({ cartItems }) => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },
  clearCart: async () => {
    set({ cart: [], total: 0, subtotal: 0 });
  },
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((state) => {
        const existingItem = state.cart.find(
          (item) => item._id === product._id
        );
        let newCart;

        if (existingItem) {
          newCart = state.cart.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newCart = [...state.cart, { ...product, quantity: 1 }];
        }

        return { cart: newCart };
      });

      get().calculateTotals();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  },
  removeFromCart: async (productId) => {
    try {
      console.log("delete functionality called!!");
      await axios.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
    } catch (error) {
      console.log("ERROR IN THE REMOVE FROM CART");
    }
  },
  updateQuantity: async (item, quantity) => {
    const productId = item._id;
    
    if (quantity === 0) {
      await get().removeFromCart(productId);
      return;
    }

    console.log("update quantity called with:", item, quantity, "productId:", productId);
    try {
      // Always use backend's return for the source-of-truth
      const response = await axios.put(`/cart`, {
        quantity,
        productId,
      });

      console.log("Updated Cart Response:", response.data);
      if (response.data && Array.isArray(response.data)) {
        set({ cart: response.data });
        get().calculateTotals();
        toast.success("Quantity updated successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update quantity";
      toast.error(errorMessage);
      // Refetch cart on error to stay in sync
      try {
        await get().getCartItems({});
      } catch (fetchError) {
        console.error("Error refetching cart:", fetchError);
      }
    }
  },
  calculateTotals: () => {
    const { cart } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;
    if (subtotal > 1000) {
      total -= subtotal * 0.1; // 10% discount for orders over ₹1000
    }

    set({ subtotal, total });
  },
}));
