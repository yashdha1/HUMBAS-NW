import React, { useState, useEffect } from "react";
import { CardHorizontal } from "./CardHorizontal";
import {
  Box,
  Heading,
  VStack,
  Text,
  Divider,
  Button,
  Textarea,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "../lib/axios";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { user } = useUserStore(); 
  const { cart, getCartItems, updateQuantity, clearCart, removeFromCart } = useCartStore();
  
  // Refresh cart when component mounts or user changes
  useEffect(() => {
    if (user) {
      getCartItems({});
    }
  }, [user]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleIncrement = async (item) => {
    try {
      const currentQuantity = item.quantity || 0;
      await updateQuantity(item, currentQuantity + 1);
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  const handleDecrement = async (item) => {
    const currentQuantity = item.quantity || 0;
    if (currentQuantity > 1) {
      try {
        await updateQuantity(item, currentQuantity - 1);
      } catch (error) {
        console.error("Error decrementing quantity:", error);
      }
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item._id);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/cart/createOrder");
      toast({
        title: "Order placed successfully!",
        description: `Your order has been placed. Order ID: ${res.data._id.slice(-8)}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      clearCart();
      // Refetch cart to ensure it's empty
      await getCartItems({});
      navigate("/orders");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error.response?.data?.message || "Failed to place order. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);
  const discount = subtotal > 1000 ? subtotal * 0.1 : 0;
  const grandTotal = subtotal - discount;

  return (
    <Box display="flex" gap={6} minH="400px" maxH="800px">
      {/* Left: Scrollable vertical stack */}
      <Box flex="1" overflowY="auto" pr={4}>
        {cart.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text fontSize="lg" color="gray.500">
              Your cart is empty
            </Text>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {cart.map((item, index) => (
              <CardHorizontal
                data={item}
                quantity={item.quantity || 0}
                key={item._id || index}
                onIncrement={() => handleIncrement(item)}
                onDecrement={() => handleDecrement(item)}
                onDelete={() => handleRemove(item)}
              />
            ))}
          </VStack>
        )}
      </Box>

      {/* Right: Static bill summary */}
      <Box minW="300px" maxW="300px" borderLeft="1px" borderColor="gray.200" pl={4}>
        <Heading size="md" mb={4} className="font-semibold">
          Your Bill
        </Heading>
        <VStack align="stretch" spacing={2} fontSize="sm">
          {cart.map((item, index) => (
            <Box key={item._id || index} display="flex" justifyContent="space-between">
              <Text>{item.name}</Text>
              <Text>₹{item.price * item.quantity}</Text>
            </Box>
          ))}
        </VStack>
        <Divider my={3} />
        <VStack align="stretch" spacing={2} fontSize="sm">
          <Box display="flex" justifyContent="space-between">
            <Text>Subtotal</Text>
            <Text>₹{subtotal.toFixed(2)}</Text>
          </Box>
          {discount > 0 && (
            <Box display="flex" justifyContent="space-between" color="green.600">
              <Text>Discount (10% off orders over ₹1000)</Text>
              <Text>-₹{discount.toFixed(2)}</Text>
            </Box>
          )}
        </VStack>
        <Divider my={3} />
        <Box display="flex" justifyContent="space-between" fontWeight="semibold" fontSize="lg">
          <Text>Grand Total</Text>
          <Text fontWeight="bold" bg="gray.100" px={2} py={1} borderRadius="md">₹{grandTotal.toFixed(2)}</Text>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button 
            colorScheme="teal" 
            onClick={handleCheckout}
            isLoading={loading}
            loadingText="Placing Order..."
            isDisabled={cart.length === 0}
            size="lg"
            width="full"
          >
            Place Order
          </Button>
        </Box>

        <Divider my={3} />
        <Box>
          <Text fontWeight="semibold" mb={2}>Notice!</Text>
          <Text fontSize="sm" color="gray.600">
            Currently we are offering Cash On Delivery services only.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
