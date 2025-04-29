import React, { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const DashboardContext = createContext();

const Test2 = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <DashboardContext.Provider value={{ toggleSidebar }}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`bg-white shadow-md h-full transition-all duration-300 ${
            isSidebarOpen ? "w-64" : "w-20"
          }`}
        ></aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
            <button
              className="p-2 rounded-md text-gray-700 hover:bg-gray-200"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? "☰" : "▶"}
            </button>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white text-center p-4 shadow-md">
            Footer Content
          </footer>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);

export default Test2;
