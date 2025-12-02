import {
  Box,
  Button,
  Text,
  VStack,
  Input,
  Heading,
  Flex,
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const SubscriptionFloater = ({
  isOpen,
  onClose,
  product, 
  phone, 
  setPhone,
  onConfirm,
  monthlyCost,
  quantityPerDay,
}) => {
  if (!isOpen || !product) return null;

  const cardBg = useColorModeValue("gray.50", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      align="center"
      justify="center"
      zIndex="1000"
      bg="blackAlpha.600"
    >
      <MotionBox
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg={cardBg}
        borderRadius="xl"
        p={6}
        boxShadow="lg"  
      >
        <Heading size="lg" mb={3} textAlign="center">
          Complete Your Subscription
        </Heading>

        <Text fontSize="sm" color="gray.600" mb={2} textAlign="center">
          You can cancel your subscription anytime from your account settings.
        </Text>

        <Text fontWeight="semibold" color="gray.700" mb={4} textAlign="center">
          Our partner will contact you soon.
        </Text>

        <Box
          borderWidth="1px"
          borderRadius="xl"
          p={4}
          mb={5}
          boxShadow="md"
          bg={cardBg}
          _hover={{ bg: hoverBg }}
        >
          <Flex justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" color="gray.500">
                Subscribing to
              </Text>
              <Text fontWeight="bold" fontSize="lg">
                {product.name}
              </Text>
              <Text fontWeight="bold" fontSize="md" color="green.600">
                ₹{monthlyCost} / month
              </Text>
            </VStack>

            <Checkbox size="lg" colorScheme="green" defaultChecked />
          </Flex>
        </Box>

        <VStack spacing={3} mb={4}>
          <Input
            placeholder="Confirm Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            bg="white"
            _focus={{ borderColor: "green.500" }}
          />
        </VStack>

        <Button
          colorScheme="green"
          w="full"
          mb={2}
          onClick={onConfirm}
          isDisabled={!phone}
        >
          Confirm & Pay
        </Button>

        <Button variant="ghost" w="full" onClick={onClose}>
          Cancel
        </Button>
      </MotionBox>
    </Flex>
  );
};

export default SubscriptionFloater;
