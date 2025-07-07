import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import RoleModal from "../components/RoleModal";
import { CommonGet, CommonPost, CommonPut } from "../common/httpClient";
import { checkPermissions } from "../utils/permissionUtils";

const Roles = () => {
  const { user } = useOutletContext();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [permission, setPermission] = useState(null);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const itemsPerPage = 10;
  const screenID = 1; // Set this to the correct screen ID for roles permissions

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
      fetchRoles();
    }
  }, [currentPage, filterValue, permission]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await CommonGet("/Role/GetRole", {
        page: currentPage,
        limit: itemsPerPage,
        search: filterValue,
      });
      let rolesData = [];
      if (response?.data) {
        rolesData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        rolesData = response;
      }
      setRoles(rolesData);
      setTotalPages(
        response?.totalPages || Math.ceil(rolesData.length / itemsPerPage)
      );
    } catch (error) {
      toast.error("Failed to fetch roles");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    if (!permission?.canAdd) {
      toast.error("You don't have permission to add roles");
      return;
    }
    setCurrentRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    if (!permission?.canEdit) {
      toast.error("You don't have permission to edit roles");
      return;
    }
    setCurrentRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteRole = async (role) => {
    if (!permission?.canDelete) {
      toast.error("You don't have permission to delete roles");
      return;
    }
    if (window.confirm("Are you sure you want to deactivate this role?")) {
      try {
        const updatedData = {
          roleName: role.roleName,
          isActive: false,
          modifiedBy: user?.userId || 1,
        };
        await CommonPut(`/Role/UpdateRole/${role.roleID}`, updatedData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Role deactivated successfully");
        fetchRoles();
      } catch (error) {
        toast.error("Failed to deactivate role");
      }
    }
  };

  const handleSubmitRole = async (roleData) => {
    try {
      if (currentRole) {
        await CommonPut(
          `/Role/UpdateRole/${currentRole.roleID}`,
          {
            ...roleData,
            modifiedBy: user?.userId || 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Role updated successfully");
      } else {
        await CommonPost(
          "/Role/SaveRole",
          {
            ...roleData,
            createdBy: user?.userId || 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Role added successfully");
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Operation failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const filteredRoles = roles.filter((role) => {
    if (!role) return false;
    const searchTerm = filterValue.toLowerCase();
    return (role.roleName?.toLowerCase() || "").includes(searchTerm);
  });

  const paginatedRoles = filteredRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: "ID", accessor: "roleID" },
    { header: "Role Name", accessor: "roleName" },
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
                    onClick={() => handleEditRole(row)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                )}
                {permission?.canDelete && (
                  <button
                    onClick={() => handleDeleteRole(row)}
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
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Role Management (Logged in as {user.username})
          </h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Filter roles..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            {permission?.canAdd && (
              <button
                onClick={handleAddRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Role
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
              data={paginatedRoles}
              onEdit={handleEditRole}
              onDelete={handleDeleteRole}
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
      {(permission?.canAdd || permission?.canEdit) && (
        <RoleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          role={currentRole}
          onSubmit={handleSubmitRole}
          user={user}
        />
      )}
    </div>
  );
};

export default Roles;
