import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ItemSubscribe from "../components/ItemSubscribe.jsx";
import { useParams } from "react-router-dom";
import { useUserStore } from "../store/useUserStore.js";
import axios from "../lib/axios.js";
import { Spinner, Center, Text } from "@chakra-ui/react";

const Subscription = () => { 
  const {user} = useUserStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionProducts();
  }, []);

  const fetchSubscriptionProducts = async () => {
    try {
      setLoading(true);
      // Fetch products with category "dairy" for subscription products
      const res = await axios.get("/product");
      // Filter for dairy products or all products if you want to show all
      const dairyProducts = res.data.products.filter(p => p.category === "dairy");
      setProducts(dairyProducts.length > 0 ? dairyProducts : res.data.products);
    } catch (error) {
      console.error("Error fetching subscription products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-red-600 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          SUBSCRIPTION PRODUCTS.  
        </motion.h1>
        <motion.p
          className="text-center text-lg  text-gray-600 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          All the Shown Images are Authentic
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {products?.map((p) => (
            <ItemSubscribe product={p} key={p._id} />
          ))}
           
        </motion.div>
      </div>
    </div>
  );
};

export default Subscription;
