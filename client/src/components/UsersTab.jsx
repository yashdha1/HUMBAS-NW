import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  HStack,
  Badge,
  Spinner,
  Center,
  Divider,
  VStack,
  Card,
  CardBody,
} from "@chakra-ui/react";
import axios from "../lib/axios";

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersWithOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        // uses /auth/check which is already wired to getAllUsers
        const res = await axios.get("/auth/check");
        setUsers(res.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(
          err.response?.data?.error || "Failed to fetch users and orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsersWithOrders();
  }, []);

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={10}>
        <Text color="red.300">{error}</Text>
      </Center>
    );
  }

  return (
    <Box className="bg-gray-800 p-4 rounded-lg shadow-md text-white">
      <Heading size="md" mb={4}>
        Users & Orders Overview
      </Heading>

      {users.length === 0 ? (
        <Text color="gray.300">No users found.</Text>
      ) : (
        <Stack spacing={4}>
          {users.map((user) => (
            <Card key={user._id} bg="gray.900" border="1px solid" borderColor="gray.700">
              <CardBody>
                <HStack justify="space-between" align="flex-start" mb={2}>
                  <Box>
                    <Text fontWeight="bold" fontSize="lg">
                      {user.username}
                    </Text>
                    <Text fontSize="sm" color="gray.300">
                      {user.email}
                    </Text>
                    <Text fontSize="sm" color="gray.400" mt={1}>
                      Phone: {user.phoneNumber}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Address: {user.address}
                    </Text>
                  </Box>
                  <VStack align="flex-end" spacing={1}>
                    <Badge colorScheme="blue" borderRadius="full" px={3}>
                      {user.role || "user"}
                    </Badge>
                    <Text fontSize="sm" color="gray.300">
                      Orders: {user.totalOrders ?? 0}
                    </Text>
                    <Text fontSize="sm" color="green.300">
                      Total Spent: ₹{user.totalAmountSpent ?? 0}
                    </Text>
                  </VStack>
                </HStack>

                <Divider my={3} borderColor="gray.700" />

                <Box>
                  <Text fontWeight="semibold" fontSize="sm" mb={2}>
                    Recent Orders
                  </Text>
                  {user.recentOrders && user.recentOrders.length > 0 ? (
                    <VStack align="stretch" spacing={2}>
                      {user.recentOrders.map((order) => (
                        <HStack
                          key={order._id}
                          justify="space-between"
                          fontSize="sm"
                          bg="gray.800"
                          p={2}
                          borderRadius="md"
                        >
                          <Box>
                            <Text color="gray.200">
                              #{String(order._id).slice(-8).toUpperCase()}
                            </Text>
                            <Text color="gray.400">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : ""}
                            </Text>
                          </Box>
                          <VStack align="flex-end" spacing={0}>
                            <Text color="green.300" fontWeight="bold">
                              ₹{order.totalAmount}
                            </Text>
                            <Badge
                              colorScheme={
                                order.status === "Delivered"
                                  ? "green"
                                  : order.status === "Cancelled"
                                  ? "red"
                                  : "yellow"
                              }
                              variant="subtle"
                            >
                              {order.status}
                            </Badge>
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      No orders yet.
                    </Text>
                  )}
                </Box>
              </CardBody>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default UsersTab;