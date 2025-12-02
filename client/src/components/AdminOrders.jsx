import React, { useState, useEffect } from "react";
import {
  Box,
  Button, 
  Heading, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  Card,
  CardBody,
  Text,
  Image,
  Badge,
  HStack,
  Divider,
  Spinner,
  Center,
  Select,
} from "@chakra-ui/react";
import axios from "../lib/axios";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { toast } from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (selectedStatus !== "All") {
        const res = await axios.get("/order/status", { params: { status: selectedStatus } });
        setOrders(res.data);
      } else {
        const res = await axios.get("/order");
        setOrders(res.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put("/order", { orderId, status: newStatus });
      toast.success("Order status updated successfully");
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "yellow";
      case "Shipped":
        return "blue";
      case "Delivered":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading>All Orders</Heading>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Filter: {selectedStatus}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setSelectedStatus("All")}>All</MenuItem>
            <MenuItem onClick={() => setSelectedStatus("Pending")}>Pending</MenuItem>
            <MenuItem onClick={() => setSelectedStatus("Shipped")}>Shipped</MenuItem>
            <MenuItem onClick={() => setSelectedStatus("Delivered")}>Delivered</MenuItem>
            <MenuItem onClick={() => setSelectedStatus("Cancelled")}>Cancelled</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      {orders.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Text fontSize="lg" color="gray.500">
            No orders found
          </Text>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {orders.map((order) => (
            <Card key={order._id} shadow="md">
              <CardBody>
                <HStack justify="space-between" mb={3}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Order ID: {order._id.slice(-8)}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                    {order.userId && typeof order.userId === 'object' && (
                      <Text fontSize="xs" color="gray.400">
                        Customer: {order.userId.username || order.userId.email}
                      </Text>
                    )}
                  </Box>
                  <Badge colorScheme={getStatusColor(order.status)} fontSize="md" px={3} py={1}>
                    {order.status}
                  </Badge>
                </HStack>
                
                <Divider my={3} />
                
                <VStack align="stretch" spacing={2}>
                  {order.products.map((item, idx) => (
                    <HStack key={idx} justify="space-between">
                      <HStack spacing={3}>
                        {item.product?.image && (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            boxSize="50px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                        )}
                        <Box>
                          <Text fontWeight="semibold">{item.product?.name || "Product"}</Text>
                          <Text fontSize="sm" color="gray.500">
                            Qty: {item.quantity} × ₹{item.price}
                          </Text>
                        </Box>
                      </HStack>
                      <Text fontWeight="bold">₹{item.quantity * item.price}</Text>
                    </HStack>
                  ))}
                </VStack>
                
                <Divider my={3} />
                
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="lg" fontWeight="bold">
                    Total Amount:
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="green.600">
                    ₹{order.totalAmount}
                  </Text>
                </HStack>

                <Box>
                  <Text fontSize="sm" mb={2} fontWeight="semibold">
                    Update Status:
                  </Text>
                  <Select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    size="sm"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </Select>
                </Box>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default Orders;
