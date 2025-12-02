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
} from "@chakra-ui/react";
import { useUserStore } from "../store/useUserStore";
import { useCartStore } from "../store/useCartStore";
import toast from "react-hot-toast";

const Item = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
      console.log("Success")
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  return (
    <Card
      maxW="sm"
      className="h-[400px] flex flex-col justify-between rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200"
    >
      <Image
        src={product.image}
        alt={product.name}
        className="object-cover h-48 w-full"
      />

      <div className="flex flex-col flex-1 justify-between">
        <CardBody className="p-5 flex-1">
          <Heading size="md" className="text-lg font-bold text-gray-800">
            {product.name}
          </Heading>

          <Text mt="2" className="text-green-700 font-semibold text-md">
            ₹{product.price}
          </Text>

          <Text mt="2" className="text-gray-600 text-sm line-clamp-3">
            {product.description}
          </Text>
        </CardBody>

        <CardFooter className="px-5 pb-5">
          {user && (
            <Stack direction="row" spacing="6" className="w-full">
              <button className="w-full px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              onClick={handleAddToCart}>
                Add to Cart
              </button>
            </Stack>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default Item;
