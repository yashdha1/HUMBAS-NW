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
  Container,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/useOrderStore";

const OrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const { orders, loading, fetchUserOrders } = useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserOrders(selectedStatus);
  }, [selectedStatus, fetchUserOrders]);

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
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">My Orders</Heading>
        <HStack spacing={4}>
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
          <Button colorScheme="blue" onClick={() => navigate("/profile")}>
            Back to Profile
          </Button>
        </HStack>
      </Box>

      {orders.length === 0 ? (
        <Card>
          <CardBody textAlign="center" py={12}>
            <Text fontSize="xl" color="gray.500" mb={4}>
              No orders found
            </Text>
            <Button colorScheme="teal" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </CardBody>
        </Card>
      ) : (
        <VStack spacing={4} align="stretch">
          {orders.map((order) => (
            <Card key={order._id} shadow="md" borderRadius="lg">
              <CardBody>
                <HStack justify="space-between" mb={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500" fontWeight="semibold">
                      Order ID: {order._id.slice(-8).toUpperCase()}
                    </Text>
                    <Text fontSize="xs" color="gray.400" mt={1}>
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </Box>
                  <Badge
                    colorScheme={getStatusColor(order.status)}
                    fontSize="md"
                    px={4}
                    py={1}
                    borderRadius="full"
                  >
                    {order.status}
                  </Badge>
                </HStack>

                <Divider my={4} />

                <VStack align="stretch" spacing={3}>
                  {order.products.map((item, idx) => (
                    <HStack
                      key={idx}
                      justify="space-between"
                      p={3}
                      bg="gray.50"
                      borderRadius="md"
                    >
                      <HStack spacing={4} flex={1}>
                        {item.product?.image && (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            boxSize="80px"
                            objectFit="cover"
                            borderRadius="md"
                            border="1px solid"
                            borderColor="gray.200"
                          />
                        )}
                        <Box>
                          <Text fontWeight="semibold" fontSize="md">
                            {item.product?.name || "Product"}
                          </Text>
                          <Text fontSize="sm" color="gray.500" mt={1}>
                            Quantity: {item.quantity} × ₹{item.price}
                          </Text>
                        </Box>
                      </HStack>
                      <Text fontWeight="bold" fontSize="lg" color="green.600">
                        ₹{item.quantity * item.price}
                      </Text>
                    </HStack>
                  ))}
                </VStack>

                <Divider my={4} />

                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="semibold">
                    Total Amount:
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color="green.600">
                    ₹{order.totalAmount}
                  </Text>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default OrdersPage;

