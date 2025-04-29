import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Permissions from "./pages/Permissions";
import Screens from "./pages/Screens";
import Products from "./pages/Products";
//import Categories from "./pages/Categories";
//import FAQ from "./pages/FAQ";
//import Feedback from "./pages/Feedback";

import "./App.css";

import { CommonGet } from "./common/httpClient"; // Adjust path as needed

import {
  Login,
  Dashboard,
  Errors,
  Register,
  DashboardLayout,
  ProductLayout,
  TestApp,
  ProfilePage,
  AddProductForm,
  Check,
  AddCategory,
  PermissionsManager,
} from "./pages";

import { action as addCategoryAction } from "./pages/AddCategory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,

    errorElement: <Errors />,
    children: [
      {
        path: "products",
        element: <ProductLayout />,
      },
      {
        path: "add-products",
        element: <AddProductForm />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "check",
        element: <Check />,
      },

      {
        path: "/dashboard/permissions",
        element: <Permissions />,
      },
      {
        path: "add-category",
        element: <AddCategory />,
        action: addCategoryAction,
      },
      {
        path: "/dashboard/permissions1",
        element: <PermissionsManager />,
      },

      {
        path: "/dashboard/overview",
        element: <Dashboard />,
      },

      {
        path: "/dashboard/users",
        element: <Users />,
      },
      {
        path: "/dashboard/screens",
        element: <Screens />,
      },

      {
        path: "/dashboard/roles",
        element: <Roles />,
      },

      {
        path: "/dashboard/products",
        element: <Products />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
  <ToastContainer position="bottom-right" autoClose={3000} />;
};

export default App;
