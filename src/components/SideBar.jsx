import React from "react";
import { useDashboardContext } from "../pages/DashboardLayout";
import { FaTimes } from "react-icons/fa";
import NavLinks from "./NavLinks";

const SideBar = ({ isOpen }) => {
  const { toggleSidebar } = useDashboardContext();

  return (
    <>
      {/* Overlay for mobile view */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`bg-gray-900 w-64 min-h-screen p-4 fixed top-0 left-0 transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white text-2xl md:hidden"
        >
          <FaTimes />
        </button>

        {/* Sidebar Content */}
        <div className="text-white text-2xl font-bold mb-6">Dashboard</div>
        <NavLinks isBigSidebar={true} />
      </div>
    </>
  );
};

export default SideBar;
