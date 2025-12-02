import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

export default function Navbar() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user; // true if user is logged in

  return (
    <div className="absolute top-0 left-0 w-full z-30 bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-3xl font-bold cursor-pointer" onClick={() => navigate("/")}>Humbas</div>

      <div className="space-x-4 text-sm font-medium flex items-center">
        {!isLoggedIn && (
          <>
            <button
              className="hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="hover:underline"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </>
        )}

        {isLoggedIn && (
          <>
            <button
              className="text-lime-300 hover:underline font-bold"
              onClick={logout}
            >
              Logout
            </button>

            {!isAdmin && (
              <>
                <button
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-sm hover:bg-blue-400 transition duration-100 shadow-md"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button
                  className="px-4 py-1.5 bg-purple-600 text-white rounded-sm hover:bg-purple-400 transition duration-100 shadow-md"
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </button>
              </>
            )}

            {isAdmin && (
              <>
                <button
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-sm hover:bg-blue-400 transition duration-100 shadow-md"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
                
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
