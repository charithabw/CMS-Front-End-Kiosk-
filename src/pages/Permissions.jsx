import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TopBar from "../components/TopBar";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { useOutletContext } from "react-router-dom";
import { CommonGet, CommonPost, CommonPut } from "../common/httpClient";
import { checkPermissions } from "../utils/permissionUtils";
import Pagination from "../components/Pagination";
import PermissionModal from "../components/PermissionModal";

const Permissions = () => {
  const { user } = useOutletContext();
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roles, setRoles] = useState([]);
  const [screens, setScreens] = useState([]);
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
      fetchPermissions();
      fetchRoles();
      fetchScreens();
    }
  }, [currentPage, filterValue, permission]);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await CommonGet("/Permission/GetAllPermissions", {
        page: currentPage,
        limit: itemsPerPage,
        search: filterValue,
      });
      let permissionsData = [];
      if (response?.data) {
        permissionsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        permissionsData = response;
      }
      setPermissions(permissionsData);
      setTotalPages(
        response?.totalPages || Math.ceil(permissionsData.length / itemsPerPage)
      );
    } catch (error) {
      toast.error("Failed to fetch permissions");
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await CommonGet("/Role/GetRole", {});
      let rolesData = [];
      if (response?.data) {
        rolesData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        rolesData = response;
      }
      setRoles(rolesData);
    } catch (error) {
      toast.error("Failed to fetch roles for dropdown");
      setRoles([]);
    }
  };

  const fetchScreens = async () => {
    try {
      const response = await CommonGet("/Screen/GetScreen", {});
      let screensData = [];
      if (response?.data) {
        screensData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        screensData = response;
      }
      setScreens(screensData);
    } catch (error) {
      toast.error("Failed to fetch screens for dropdown");
      setScreens([]);
    }
  };

  const handleAddPermission = () => {
    if (!permission?.canAdd) {
      toast.error("You don't have permission to add permissions");
      return;
    }
    setCurrentPermission(null);
    setIsModalOpen(true);
  };

  const handleEditPermission = (perm) => {
    if (!permission?.canEdit) {
      toast.error("You don't have permission to edit permissions");
      return;
    }
    setCurrentPermission(perm);
    setIsModalOpen(true);
  };

  const handleDeletePermission = async (perm) => {
    if (!permission?.canDelete) {
      toast.error("You don't have permission to delete permissions");
      return;
    }
    if (
      window.confirm("Are you sure you want to deactivate this permission?")
    ) {
      try {
        const updatedData = {
          permissionName: perm.permissionName,
          permissionCode: perm.permissionCode,
          screenID: perm.screenID,
          roleID: perm.roleID,
          canAdd: perm.canAdd,
          canEdit: perm.canEdit,
          canDelete: perm.canDelete,
          canView: perm.canView,
          isActive: false,
          modifiedBy: user?.userId || 1,
        };
        await CommonPut(
          `/Permission/UpdatePermission/${perm.permissionID}`,
          updatedData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Permission deactivated successfully");
        fetchPermissions();
      } catch (error) {
        toast.error("Failed to deactivate permission");
      }
    }
  };

  const handleSubmitPermission = async (permData) => {
    try {
      if (currentPermission) {
        await CommonPut(
          `/Permission/UpdatePermission/${currentPermission.permissionID}`,
          {
            ...permData,
            modifiedBy: user?.userId || 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Permission updated successfully");
      } else {
        await CommonPost(
          "/Permission/SavePermission",
          {
            ...permData,
            createdBy: user?.userId || 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Permission added successfully");
      }
      setIsModalOpen(false);
      fetchPermissions();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Operation failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const filteredPermissions = permissions.filter((p) => {
    if (!p) return false;
    const searchTerm = filterValue.toLowerCase();
    return (
      (p.permissionName?.toLowerCase() || "").includes(searchTerm) ||
      (p.permissionCode?.toLowerCase() || "").includes(searchTerm)
    );
  });

  const paginatedPermissions = filteredPermissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: "ID", accessor: "permissionID" },
    { header: "Name", accessor: "permissionName" },
    { header: "Code", accessor: "permissionCode" },
    {
      header: "Screen",
      accessor: "screenID",
      cell: (value) =>
        screens.find((s) => s.screenID === value)?.screenName || value,
    },
    {
      header: "Role",
      accessor: "roleID",
      cell: (value) => roles.find((r) => r.roleID === value)?.roleName || value,
    },
    {
      header: "Add",
      accessor: "canAdd",
      cell: (value) => (value ? "✔" : "✖"),
    },
    {
      header: "Edit",
      accessor: "canEdit",
      cell: (value) => (value ? "✔" : "✖"),
    },
    {
      header: "Delete",
      accessor: "canDelete",
      cell: (value) => (value ? "✔" : "✖"),
    },
    {
      header: "View",
      accessor: "canView",
      cell: (value) => (value ? "✔" : "✖"),
    },
    {
      header: "Active",
      accessor: "isActive",
      cell: (value) => (value ? "✔" : "✖"),
    },
    //{ header: "Created Date", accessor: "createdDate" },
    //{ header: "Created By", accessor: "createdBy" },
    ...(permission?.canEdit || permission?.canDelete
      ? [
          {
            header: "Actions",
            accessor: "actions",
            cell: (_, row) => (
              <div className="flex space-x-2">
                {permission?.canEdit && (
                  <button
                    onClick={() => handleEditPermission(row)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                )}
                {permission?.canDelete && (
                  <button
                    onClick={() => handleDeletePermission(row)}
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
      <TopBar title="Permission Management" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Permission Management (Logged in as {user.username})
            </h2>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Filter permissions..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              {permission?.canAdd && (
                <button
                  onClick={handleAddPermission}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Permission
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
                data={paginatedPermissions}
                onEdit={handleEditPermission}
                onDelete={handleDeletePermission}
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
        <PermissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          permission={currentPermission}
          onSubmit={handleSubmitPermission}
          user={user}
          roles={roles}
          screens={screens}
        />
      )}
    </div>
  );
};

export default Permissions;
