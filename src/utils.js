// src/utils/links.js
import { FaHome, FaUserCog, FaCogs, FaUsers } from "react-icons/fa";

const links = [
  {
    text: "Home",
    path: "/dashboard",
    icon: <FaHome />,
  },
  {
    text: "Users",
    path: "/dashboard/users",
    icon: <FaUserCog />,
  },
  {
    text: "Settings",
    path: "/settings",
    icon: <FaCogs />,
    subLinks: [
      { text: "Account", path: "/settings/account" },
      { text: "Notifications", path: "/settings/notifications" },
      { text: "Privacy", path: "/settings/privacy" },
    ],
  },
  {
    text: "Users",
    path: "/users",
    icon: <FaUsers />,
    subLinks: [
      { text: "All Users", path: "/users/all" },
      { text: "Add User", path: "/users/add" },
    ],
  },
];

export default links;
