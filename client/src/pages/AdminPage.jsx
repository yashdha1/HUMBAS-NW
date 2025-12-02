import { Clock10, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";


import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AdminOrders from "../components/AdminOrders"; 
import UsersTab from "../components/UsersTab";

import { useProductStore } from "../store/useProductStore"; 
 


const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "Orders", label: "Orders", icon: Clock10 },
  { id: "users", label: "All Users", icon: PlusCircle },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
         <h1 className="text-3xl font-bold text-center mb-8 hover:text-emerald-600">
          Admin Dashboard 
         </h1> 

        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id) }
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id 
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
        {/* show the active tab */}
        {activeTab === "create" && <CreateProductForm />}
        {activeTab === "products" && <ProductsList />}
        {activeTab === "Orders" && <AdminOrders />}
        {activeTab === "Users" && <UsersTab />}
      </div>
    </div>
  );
};
export default AdminPage;
