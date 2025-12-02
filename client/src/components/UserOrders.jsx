import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
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
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import { useOrderStore } from "../store/useOrderStore";

const statusTabs = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const { orders, loading, fetchUserOrders } = useOrderStore();

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
      <Center py={8}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box>
      <Heading mb={4} size="md">
        Orders History
      </Heading>

      <Tabs
        variant="soft-rounded"
        colorScheme="teal"
        mb={4}
        onChange={(index) => setSelectedStatus(statusTabs[index])}
      >
        <TabList>
          {statusTabs.map((status) => (
            <Tab key={status} fontSize="sm">
              {status}
            </Tab>
          ))}
        </TabList>
      </Tabs>

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
                  </Box>
                  <Badge
                    colorScheme={getStatusColor(order.status)}
                    fontSize="md"
                    px={3}
                    py={1}
                  >
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
                          <Text fontWeight="semibold">
                            {item.product?.name || "Product"}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Qty: {item.quantity} × ₹{item.price}
                          </Text>
                        </Box>
                      </HStack>
                      <Text fontWeight="bold">
                        ₹{item.quantity * item.price}
                      </Text>
                    </HStack>
                  ))}
                </VStack>

                <Divider my={3} />

                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
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
    </Box>
  );
};

export default Orders;
