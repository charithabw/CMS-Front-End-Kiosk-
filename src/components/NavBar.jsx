import React from "react";
import { useDashboardContext } from "../pages/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const NavBar = () => {
  const { toggleSidebar } = useDashboardContext();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <div className="flex w-full justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-700 md:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Bank_of_Ceylon.svg/330px-Bank_of_Ceylon.svg.png"
          alt="Bank of Ceylon"
          className="w-20 ml-4"
        />
        <span className="ml-4 text-xl font-semibold">Admin Dashboard</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {user && (
          <span className="hidden md:inline text-gray-700">
            Welcome, {user.username}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;
