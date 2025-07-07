// src/layouts/DashboardLayout.js
import React, { createContext, useContext, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import "../index.css";
import { useAuth } from "../context/AuthContext";

const DashboardContext = createContext();

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const auth = useAuth();

  // Handle case where auth context might not be available
  if (!auth) {
    return <div>Loading authentication...</div>;
  }
  const { user, loading } = auth;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardContext.Provider value={{ toggleSidebar, isSidebarOpen, user }}>
      <div className="min-h-screen flex bg-slate-300">
        {/* Sidebar */}
        <SideBar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
            <NavBar user={user} />
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet context={{ user }} />
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
