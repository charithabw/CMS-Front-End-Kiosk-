import React from "react";
import {
  UsersIcon,
  ShieldCheckIcon,
  DesktopComputerIcon,
  CubeIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  ChatIcon,
  CogIcon,
} from "@heroicons/react/outline";

const StatCard = ({ title, value, icon, color }) => {
  const getIcon = () => {
    switch (icon) {
      case "users":
        return <UsersIcon className={`h-8 w-8 text-${color}-500`} />;
      case "shield":
        return <ShieldCheckIcon className={`h-8 w-8 text-${color}-500`} />;
      case "desktop":
        return <DesktopComputerIcon className={`h-8 w-8 text-${color}-500`} />;
      case "box":
        return <CubeIcon className={`h-8 w-8 text-${color}-500`} />;
      case "chart":
        return <ChartBarIcon className={`h-8 w-8 text-${color}-500`} />;
      case "question":
        return (
          <QuestionMarkCircleIcon className={`h-8 w-8 text-${color}-500`} />
        );
      case "chat":
        return <ChatIcon className={`h-8 w-8 text-${color}-500`} />;
      case "settings":
        return <CogIcon className={`h-8 w-8 text-${color}-500`} />;
      default:
        return <ChartBarIcon className={`h-8 w-8 text-${color}-500`} />;
    }
  };

  const getBgColor = () => {
    switch (color) {
      case "blue":
        return "bg-blue-50";
      case "green":
        return "bg-green-50";
      case "purple":
        return "bg-purple-50";
      case "orange":
        return "bg-orange-50";
      case "red":
        return "bg-red-50";
      case "indigo":
        return "bg-indigo-50";
      case "pink":
        return "bg-pink-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${getBgColor()} p-3 rounded-full mr-4`}>
          {getIcon()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
        </div>
      </div>
      <div
        className={`mt-4 h-1 w-full bg-${color}-100 rounded-full overflow-hidden`}
      >
        <div
          className={`h-full bg-${color}-500 rounded-full`}
          style={{ width: "70%" }}
        ></div>
      </div>
    </div>
  );
};

export default StatCard;
