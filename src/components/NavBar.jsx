import React from "react";
import { useDashboardContext } from "../pages/DashboardLayout";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const { toggleSidebar } = useDashboardContext();
  const navigate = useNavigate();

  const logoutUser = () => {
    navigate("/");
  };

  return (
    <div className="flex w-full justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-700 md:hidden p-2">
          ☰
        </button>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Bank_of_Ceylon.svg/330px-Bank_of_Ceylon.svg.png"
          alt="Bank of Ceylon"
          className="w-20 ml-4"
        />
        <span className="ml-4 text-xl font-semibold">Admin Dashboard</span>
      </div>

      {/* Right Section */}
      <div>
        <button
          onClick={logoutUser}
          className="bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;
