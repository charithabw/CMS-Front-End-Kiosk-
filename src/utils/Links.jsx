// src/utils/links.js
import React from "react";
import { FaHome, FaCogs, FaBox, FaUsers } from "react-icons/fa";

const Links = [
  {
    text: "Home",
    path: "/dashboard/overview",
    icon: <FaHome />,
  },

  {
    text: "Users",
    path: "/dashboard/users",
    icon: <FaUsers />,
  },

  {
    text: "Role Management",
    path: "/dashboard/Roles",
    icon: <FaCogs />,
  },

  {
    text: "Screens",
    path: "/dashboard/screens",
    icon: <FaCogs />,
  },

  {
    text: "Permissions",
    path: "/dashboard/permissions",
    icon: <FaCogs />,
  },

  {
    text: "Admin",
    path: "/admin",
    icon: <FaCogs />,
    subLinks: [
      { text: "General Settings", path: "/dashboard/settings" },
      { text: "User Permissions", path: "/dashboard/permissions" },
    ],
  },
  {
    text: "Settings",
    path: "/settings",
    icon: <FaBox />,
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
      { text: "Add Product", path: "/add-products" },
      { text: "Products", path: "/products" },
      { text: "profile", path: "/profile" },
      { text: "check", path: "/check" },
      { text: "AddCategory", path: "/add-category" },
    ],
  },
];

export default Links;
