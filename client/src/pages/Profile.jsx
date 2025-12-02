import {
  Box,
  Button,
  Text,
  Heading,
  Stack,
  Card,
  CardBody,
  VStack,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import Cart from "../components/Cart";
import Orders from "../components/UserOrders";
import { useUserStore } from "../store/useUserStore";
import { useEffect } from "react";
import { useCartStore } from "../store/useCartStore";

const Profile = () => {
  const { user } = useUserStore();
  const { getCartItems } = useCartStore();
  const navigate = useNavigate();
  
  // Refresh cart when profile loads
  useEffect(() => {
    if (user) {
      getCartItems({});
    }
  }, [user]); 
 

  const cardBg = useColorModeValue("white", "gray.800");
  const cardShadow = useColorModeValue("md", "dark-lg");

  return (
    <Box maxW="6xl" mx="auto" px={{ base: 4, md: 8 }} py={6}>
      {/* Profile Info Card */}
      <Card
        bg={cardBg}
        shadow={cardShadow}
        borderRadius="2xl"
        overflow="hidden"
        mb={8}
      >
        <CardBody>
          <Stack
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            spacing={6}
          >
            <VStack align="start" spacing={2}>
              <Heading size="lg">Welcome, {user.username}</Heading>
              <Text>
                <b>Email:</b> {user.email}
              </Text>
              <Text>
                <b>Phone:</b> {user.phoneNumber}
              </Text>
              <Text>
                <b>Address:</b> {user.address}
              </Text>
              <Text>
                <b>Total Orders:</b> {user.orders?.length || 0}
              </Text>
            </VStack>

            <VStack spacing={2} align={{ base: "stretch", md: "flex-end" }}>
              <Button
                colorScheme="blue"
                onClick={() => navigate("/orders")}
              >
                View All Orders
              </Button>
              <Button
                colorScheme="gray"
                variant="outline"
              >
                Edit Profile
              </Button>
            </VStack>
          </Stack>
        </CardBody>
      </Card>

      <Tabs isFitted variant="enclosed-colored" colorScheme="teal">
        <TabList
          mb="4"
          borderRadius="xl"
          overflow="hidden"
          border="1px solid"
          borderColor="gray.200"
        >
          <Tab fontWeight="semibold">Cart</Tab>
          <Tab fontWeight="semibold">Orders</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Cart />
          </TabPanel>
          <TabPanel>
            <Orders />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Profile;
