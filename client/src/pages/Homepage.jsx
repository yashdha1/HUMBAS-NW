import React from "react";
import { Link } from "react-router-dom";
import { sections } from "../constants/section";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { ArrowRightToLine } from "lucide-react";

export default function Homepage() {
  
  const products = [
    {
      _id: 1,
      name: "Organic Paneer",
      image:
        "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      price: 1501,
      quantity: 1,
    },
    {
      _id: 2,
      name: "Organic Paneer",
      image:
        "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      price: 1501,
      quantity: 1,
    },
    {
      _id: 3,
      name: "Organic Paneer",
      image:
        "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      price: 1501,
      quantity: 1,
    },
  ];
  const navigate = useNavigate();
  return (
    <div className="font-sans text-gray-800">
      {/* HEADER */}
      <header className="relative h-screen overflow-hidden bg-white">
        {/* Navbar */}
        {/* <Navbar /> */}

        {/* Right Background Image */}
        <div className="absolute top-0 right-0 w-2/3 h-full z-10 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2"
            alt="farm background"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Left Foreground Content */}
        <div className="relative z-20 h-full flex items-center bg-green-50 bg-opacity-95 px-8 md:px-16 lg:px-24 md:w-1/5">
          <div>
            <h1 className="text-6xl md:text-7xl font-bold mb-4 text-green-800 leading-tight">
              HUMBAS
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-green-700">
              Fresh From Farm to Fork
            </h2>
            <p className="text-lg md:text-xl text-gray-700">
              Experience farm-fresh quality and same-day delivery from
              Amravati’s local farmers.
            </p>
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="bg-white p-8 space-y-16">
        {/* Highlights Section */}
        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-8 p-4 color-green-800 ">
            PRODUCTS WE ARE OFFERING
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {sections.map((item, index) => (
              <div
                key={index}
                className="hover:cursor-pointer bg-white border border-green-200 hover:shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row transition duration-300"
                onClick={() => navigate(`/items/${item.title}`)}
              >
                {/* Left image/emoji */}
                <div className="bg-green-100 flex items-center justify-center w-full md:w-1/2 h-48 md:h-auto text-5xl text-green-600">
                  🛒
                </div>

                {/* Right content */}
                <div className="p-6 flex flex-col justify-center w-full md:w-1/2">
                  <h3 className="text-2xl font-semibold text-green-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-green-50 py-12 px-4 sm:px-8 md:px-16 text-3xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-green-900 mb-6 leading-tight">
              Discover Organic Subscriptions
            </h2>
            <p className="text-lg sm:text-xl text-green-700">
              Fresh. Natural. Hassle-free. Subscribe & never run out of your
              favorite organic products.
            </p>
            <p className="text-lg sm:text-xl text-green-700 mb-8">
              daily. to door service. freshness guaranteed.
            </p>
            <button
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300"
              onClick={() => navigate("/subscriptions")}
              // onClick={() => navigate(`/items/${item.title}`)}
            >
              Explore Subscriptions
              <ArrowRightToLine className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-green-50 py-12 rounded-xl shadow text-center max-w-5xl mx-auto">
          <h3 className="text-4xl font-semibold mb-6 text-green-800">
            Why Choose Us
          </h3>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-white p-6 rounded-lg shadow w-64 transform hover:-translate-y-2 transition duration-300">
              <div className="text-3xl mb-2">🌱</div>
              100% Natural Products
            </div>
            <div className="bg-white p-6 rounded-lg shadow w-64 transform hover:-translate-y-2 transition duration-300">
              <div className="text-3xl mb-2">🚚</div>
              Same Day Delivery
            </div>
            <div className="bg-white p-6 rounded-lg shadow w-64 transform hover:-translate-y-2 transition duration-300">
              <div className="text-3xl mb-2">👨‍🌾</div>
              Direct from Farmers
            </div>
            <div className="bg-white p-6 rounded-lg shadow w-64 transform hover:-translate-y-2 transition duration-300">
              <div className="text-3xl mb-2">👨‍🌾</div>
              First Time in Amravati
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-semibold mb-8 text-center text-green-800">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample reviews */}
            {["Great service!", "Fresh produce!", "Highly recommend!"].map(
              (review, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition duration-300"
                >
                  <p className="text-gray-700">{review}</p>
                  <p className="mt-4 font-semibold text-green-700">Customer</p>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-green-700 text-white py-10 mt-16 ">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
          <div>
            <h5 className="text-xl font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-sm hover: hover:cursor-pointer">
              <li className="hover:underline ">Home</li>
              <li className="hover:underline">About</li>
              <li className="hover:underline">Services</li>
              <li className="hover:underline">Contact</li>
            </ul>
          </div>
          <div>
            <h5 className="text-xl font-semibold mb-4">Contact Info</h5>
            <ul className="space-y-2 text-sm">
              <li>📍 Amravati, Maharashtra</li>
              <li className="hover:underline">bhushan@humbas.com</li>
              <li className="hover:underline">+91 98765 43210</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
