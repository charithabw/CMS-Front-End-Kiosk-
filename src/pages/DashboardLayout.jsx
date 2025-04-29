import React, { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import "../index.css";
const DashboardContext = createContext();

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <DashboardContext.Provider value={{ toggleSidebar, isSidebarOpen }}>
      <div className="min-h-screen flex bg-slate-300">
        {/* Sidebar */}
        <SideBar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
            <NavBar />
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

export default DashboardLayout;
