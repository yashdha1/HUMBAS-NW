import { useState } from "react";
import { Trash } from "lucide-react";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useProductStore } from "../store/useProductStore";

const ProductsList = () => {
  const { deleteProduct, products } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="flex flex-col">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Filter Category
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleCategoryFilter("dairy")}>Dairy</MenuItem>
            <MenuItem onClick={() => handleCategoryFilter("fruits")}>Fruits</MenuItem>
            <MenuItem onClick={() => handleCategoryFilter("vegetables")}>Vegetables</MenuItem>
            <MenuItem onClick={() => handleCategoryFilter("others")}>Others</MenuItem>
            <MenuItem onClick={() => handleCategoryFilter(null)}>All</MenuItem>
          </MenuList>
        </Menu>
      </Box>

      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Products
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {filteredProducts?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  RS {product.price}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  // Uncomment this when deleteProduct is ready
                  // onClick={() => deleteProduct(product._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsList;
