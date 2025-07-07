// src/pages/Screens.js
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import TopBar from "../components/TopBar";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import ScreenModal from "../components/ScreenModal";
import { CommonGet, CommonPost, CommonPut } from "../common/httpClient";
import { checkPermissions } from "../utils/permissionUtils";

/*
const initialScreens = [
  {
    screenId: 1,
    screenCode: "USR",
    screenName: "Users",
    isActive: true,
    createdDate: "2025-04-27",
    lastEditedBy: "admin",
  },
  {
    screenId: 2,
    screenCode: "PRD",
    screenName: "Products",
    isActive: true,
    createdDate: "2025-04-27",
    lastEditedBy: "admin",
  },
]; */

const Screens = () => {
  const { user } = useOutletContext();
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [permission, setPermission] = useState(null);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const itemsPerPage = 10;
  const screenID = 1; // Set this to the correct screen ID for permissions

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const perm = await checkPermissions(user?.roleId, screenID);
        setPermission(perm);
      } catch (error) {
        setPermission({
          canView: false,
          canAdd: false,
          canEdit: false,
          canDelete: false,
        });
      } finally {
        setPermissionLoading(false);
      }
    };
    if (user?.roleId) {
      fetchPermission();
    } else {
      setPermissionLoading(false);
    }
  }, [user?.roleId]);

  useEffect(() => {
    if (permission?.canView) {
      fetchScreens();
    }
  }, [currentPage, filterValue, permission]);

  const fetchScreens = async () => {
    try {
      setLoading(true);
      const response = await CommonGet("/Screen/GetScreen", {
        page: currentPage,
        limit: itemsPerPage,
        search: filterValue,
      });
      let screensData = [];
      if (response?.data) {
        screensData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        screensData = response;
      }
      setScreens(screensData);
      setTotalPages(
        response?.totalPages || Math.ceil(screensData.length / itemsPerPage)
      );
    } catch (error) {
      toast.error("Failed to fetch screens");
      setScreens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScreen = () => {
    if (!permission?.canAdd) {
      toast.error("You don't have permission to add screens");
      return;
    }
    setCurrentScreen(null);
    setIsModalOpen(true);
  };

  const handleEditScreen = (screen) => {
    if (!permission?.canEdit) {
      toast.error("You don't have permission to edit screens");
      return;
    }
    setCurrentScreen(screen);
    setIsModalOpen(true);
  };

  const handleDeleteScreen = async (screen) => {
    if (!permission?.canDelete) {
      toast.error("You don't have permission to delete screens");
      return;
    }
    if (window.confirm("Are you sure you want to deactivate this screen?")) {
      try {
        const updatedData = {
          screenCode: screen.screenCode,
          screenName: screen.screenName,
          isActive: false,
          createdDate: screen.createdDate,
          modifiedBy: user?.userId || 1,
        };
        await CommonPut(
          `/Screen/UpdateScreen/${screen.screenID}`,
          updatedData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Screen deactivated successfully");
        fetchScreens();
      } catch (error) {
        toast.error("Failed to deactivate screen");
      }
    }
  };

  const handleSubmitScreen = async (screenData) => {
    try {
      if (currentScreen) {
        await CommonPut(
          `/Screen/UpdateScreen/${currentScreen.screenID}`,
          {
            ...screenData,
            modifiedBy: user?.userId || 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Screen updated successfully");
      } else {
        await CommonPost(
          "/Screen/SaveScreen",
          {
            ...screenData,
            //createdDate: new Date().toISOString(),
            createdBy: user?.userId || 1,
          },

          /* {
            ...screenData,
            createdDate: new Date().toISOString(),
            modifiedBy: user?.userId || 1,
          },*/

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Screen added successfully");
      }
      setIsModalOpen(false);
      fetchScreens();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Operation failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const filteredScreens = screens.filter((screen) => {
    if (!screen) return false;
    const searchTerm = filterValue.toLowerCase();
    return (
      (screen.screenName?.toLowerCase() || "").includes(searchTerm) ||
      (screen.screenCode?.toLowerCase() || "").includes(searchTerm)
    );
  });

  const paginatedScreens = filteredScreens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: "ID", accessor: "screenID" },
    { header: "Code", accessor: "screenCode" },
    { header: "Name", accessor: "screenName" },
    {
      header: "Active",
      accessor: "isActive",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    { header: "Created Date", accessor: "createdDate" },
    { header: "Created By", accessor: "createdBy" },
    ...(permission?.canEdit || permission?.canDelete
      ? [
          {
            header: "Actions",
            accessor: "actions",
            cell: (_, row) => (
              <div className="flex space-x-2">
                {permission?.canEdit && (
                  <button
                    onClick={() => handleEditScreen(row)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                )}
                {permission?.canDelete && (
                  <button
                    onClick={() => handleDeleteScreen(row)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  if (permissionLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!permission?.canView) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <TopBar title="Screen Management" user={user} />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Screen Management (Logged in as {user.username})
            </h2>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Filter screens..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              {permission?.canAdd && (
                <button
                  onClick={handleAddScreen}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Screen
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={paginatedScreens}
                onEdit={handleEditScreen}
                onDelete={handleDeleteScreen}
                permission={permission}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      {(permission?.canAdd || permission?.canEdit) && (
        <ScreenModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          screen={currentScreen}
          onSubmit={handleSubmitScreen}
          user={user}
        />
      )}
    </div>
  );
};

export default Screens;
