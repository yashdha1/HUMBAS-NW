import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Global store for order-related operations (user + basic admin usage)
export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  // Fetch orders for the logged-in user, optionally filtered by status
  fetchUserOrders: async (status = "All") => {
    set({ loading: true, error: null });
    try {
      const params = status !== "All" ? { status } : {};
      const res = await axios.get("/order/user", { params });
      set({ orders: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      const message =
        error.response?.data?.message || "Failed to fetch orders";
      toast.error(message);
      set({ loading: false, error: message, orders: [] });
    }
  },

  // For future use (e.g., from cart checkout): create an order explicitly
  // Assumes backend route exists; if not, this can be wired later.
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/order", orderData);
      set((state) => ({
        orders: [res.data, ...state.orders],
        loading: false,
      }));
      toast.success("Order created successfully");
      return res.data;
    } catch (error) {
      console.error("Error creating order:", error);
      const message =
        error.response?.data?.message || "Failed to create order";
      toast.error(message);
      set({ loading: false, error: message });
      throw error;
    }
  },

  // For user-side local updates (e.g., optimistic status changes if ever allowed)
  updateOrderInStore: (orderId, updates) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order._id === orderId ? { ...order, ...updates } : order
      ),
    }));
  },
}));


