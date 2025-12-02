import {
  Box,
  Button,
  Image,
  Text,
  Heading,
  Stack,
  Card,
  CardBody,
  CardFooter,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import SubscriptionFloater from "./SubscriptionFloater";
import { useUserStore } from "../store/useUserStore.js";
import { useNavigate } from "react-router-dom";

const ItemSubscribe = ({ product }) => {
  const [isFloaterOpen, setFloaterOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [quantityPerDay, setQuantityPerDay] = useState(1);
  const toast = useToast();
  const {user} = useUserStore();
  const navigate = useNavigate();

  const monthlyCost = product.price * quantityPerDay * 30;

  const handleConfirm = () => {
    toast({
      title: "Subscription Confirmed",
      description: `You've subscribed to ${quantityPerDay}L of ${product.name}/day`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    setFloaterOpen(false);
    setPhone("");
  };

  return (
    <>
      <Card
        maxW="sm"
        overflow="hidden"
        className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-e-2 w-full flex flex-col justify-between h-[500px]"
      >
        <Image
          src={product.image}
          alt={product.name}
          borderTopRadius="lg"
          className="object-cover h-48 w-full"
        />
        <CardBody className="flex-1">
          <Heading size="md">Cow {product.name}</Heading>
          <Text mt="2" className="text-green-700 font-semibold">
            ₹{product.price} / liter
          </Text>

          <Box mt="4">
            <Text fontSize="sm" mb="1">Quantity per day (liters):</Text>
            <Select
              value={quantityPerDay}
              onChange={(e) => setQuantityPerDay(parseFloat(e.target.value))}
              size="sm"
              bg="white"
            >
              <option value={0.5}>0.5</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </Select>
          </Box>

          <Box mt="4">
            <Text fontSize="sm">Estimated Monthly Cost:</Text>
            <Text fontWeight="bold" color="green.700" fontSize="lg">
              ₹{monthlyCost}
            </Text>
          </Box>
        </CardBody>
        <CardFooter>
          <Stack direction="row" spacing="4" className="w-full">
            {user && <Button
              colorScheme="red"
              className="w-full"
              onClick={() => setFloaterOpen(true)}
            >
              Subscribe!
            </Button>}
            {!user && (
              <Button colorScheme="blue" className="w-full" onClick={() => navigate('/login')}>
                Login to Subscribe
              </Button>
            )}
          </Stack>
        </CardFooter>
      </Card>

      {/* Subscription Modal */}
      {isFloaterOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="blackAlpha.600"
          zIndex="999"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <SubscriptionFloater
            isOpen={isFloaterOpen}
            onClose={() => setFloaterOpen(false)}
            product={product}
            phone={phone}
            setPhone={setPhone}
            onConfirm={handleConfirm}
            quantityPerDay={quantityPerDay}
            monthlyCost={monthlyCost}
          />
        </Box>
      )}
    </>
  );
};

export default ItemSubscribe;