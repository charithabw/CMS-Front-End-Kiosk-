import React from "react";
import { format } from "date-fns";
import { BellIcon, SearchIcon, UserCircleIcon } from "@heroicons/react/outline";

const TopBar = ({ title }) => {
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");
  const currentUser = JSON.parse(localStorage.getItem("user")) || {
    username: "Admin",
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <BellIcon className="h-6 w-6 text-gray-600" />
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center space-x-2">
          <UserCircleIcon className="h-8 w-8 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentUser.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
