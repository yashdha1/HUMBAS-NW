import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import Homepage from "./pages/Homepage.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ItemsPage from "./pages/ItemsPage.jsx";
import Profile from "./pages/Profile.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import Subscription from "./pages/Subscription.jsx"; 
import SubscriptionFloater from "./components/SubscriptionFloater.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";

import { useUserStore } from "./store/useUserStore.js";

function App() {
  const { user, checkAuth, logout } = useUserStore();

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "64px" }}> {/* Adjust based on your Navbar height */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/items/:id" element={<ItemsPage />} />
          <Route path="/profile" element={user && user.role === "user" ? <Profile /> : <Navigate to="/" />} />
          <Route path="/orders" element={user && user.role === "user" ? <OrdersPage /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={user && user.role === "admin" ? <AdminPage /> : <Navigate to="/" />} />
          <Route path="/subscriptions" element={<Subscription />} />
          <Route path="/subscriptions/:name" element={<SubscriptionFloater />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
