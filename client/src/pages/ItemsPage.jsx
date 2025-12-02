import { motion } from "framer-motion";
import Item from "../components/Item.jsx";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore.js";

const ItemsPage = () => {
  const { products, fetchProductsByCategory } = useProductStore();
   
  const { id } = useParams() ; 
  console.log("category:", id);
  useEffect(() => {
    fetchProductsByCategory(id);
  }, [id]);
  console.log("products in this category", products);


  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Products in {id}
        </motion.h1>
        <motion.p
          className="text-center text-lg text-gray-500 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          All the Shown Images are Authentic
        </motion.p>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-2 justify-items-center"
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
            <Item product={p} key={p._id} />
          ))}
           
        </motion.div>
      </div>
    </div>
  );
};

export default ItemsPage; 