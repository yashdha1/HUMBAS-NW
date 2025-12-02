import {
  Badge,
  Box,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Image,
  Text,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";

export const CardHorizontal = ({
  data,
  quantity,
  onIncrement,
  onDecrement,
  onDelete,
}) => {
  console.log("CardHorizontal data:", data);
  console.log("CardHorizontal quantity:", quantity);
  return (
    <Card
      direction="row"
      overflow="hidden"
      maxW="full"
      variant="outline"
      m="2"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="md"
    >
      <Image
        objectFit="cover"
        maxW="200px"
        src={data.image}
        alt={data.name}
      />
      <Box flex="1">
        <CardBody>
          <Heading size="sm">{data.name}</Heading>
          <Text fontSize="sm">₹{data.price}</Text>
          <Text fontSize="xs">Metric: {data.metric}</Text>
          <HStack mt="2">
            <Badge colorScheme="green">{data.category}</Badge>
          </HStack>
        </CardBody>
        <CardFooter justify="space-between" alignItems="center">
          <HStack spacing="2">
            <IconButton
              size="sm"
              icon={<MinusIcon />}
              onClick={onDecrement}
              aria-label="decrease"
              isDisabled={quantity <= 1}
            />
            <Text>{quantity}</Text>
            <IconButton
              size="sm"
              icon={<AddIcon />}
              onClick={onIncrement}
              aria-label="increase"
            />
          </HStack>
          {onDelete && (
            <IconButton
              size="sm"
              colorScheme="red"
              variant="ghost"
              icon={<DeleteIcon />}
              onClick={onDelete}
              aria-label="remove item"
            />
          )}
        </CardFooter>
      </Box>
    </Card>
  );
};
  