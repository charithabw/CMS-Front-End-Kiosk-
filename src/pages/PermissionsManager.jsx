import React, { useState } from "react";

// Sample hardcoded data
const initialPermissions = [
  {
    permissionID: 1,
    permissionName: "Admin Access",
    permissionCode: "ADMIN",
    screenID: 1,
    roleID: 1,
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canView: true,
    isActive: true,
    createdDate: "2023-01-01",
  },
  {
    permissionID: 2,
    permissionName: "User Management",
    permissionCode: "USER_MGMT",
    screenID: 2,
    roleID: 2,
    canAdd: false,
    canEdit: true,
    canDelete: false,
    canView: true,
    isActive: true,
    createdDate: "2023-01-02",
  },
];

const initialRoles = [
  { roleID: 1, roleName: "Administrator" },
  { roleID: 2, roleName: "Manager" },
];

const initialScreens = [
  { screenID: 1, screenCode: "DASH", screenName: "Dashboard" },
  { screenID: 2, screenCode: "USERS", screenName: "User Management" },
];

const PermissionsManager = () => {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [roles] = useState(initialRoles);
  const [screens] = useState(initialScreens);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  // Form state
  const initialFormState = {
    permissionName: "",
    permissionCode: "",
    screenID: "",
    roleID: "",
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canView: false,
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentPermission) {
      // Update existing permission
      const updatedPermissions = permissions.map((perm) =>
        perm.permissionID === currentPermission.permissionID ? formData : perm
      );
      setPermissions(updatedPermissions);
      showNotification("Permission updated successfully");
    } else {
      // Create new permission
      const newPermission = {
        ...formData,
        permissionID: permissions.length + 1,
        createdDate: new Date().toISOString(),
      };
      setPermissions([...permissions, newPermission]);
      showNotification("Permission created successfully");
    }

    closeModal();
  };

  const handleEdit = (permission) => {
    setCurrentPermission(permission);
    setFormData(permission);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      const filteredPermissions = permissions.filter(
        (perm) => perm.permissionID !== id
      );
      setPermissions(filteredPermissions);
      showNotification("Permission deleted successfully");
    }
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPermission(null);
    setFormData(initialFormState);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Permissions Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Create Permission
        </button>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Screen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Access
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {permissions.map((permission) => {
              const role = roles.find((r) => r.roleID === permission.roleID);
              const screen = screens.find(
                (s) => s.screenID === permission.screenID
              );

              return (
                <tr key={permission.permissionID}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {permission.permissionName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {permission.permissionCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {role?.roleName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {screen?.screenName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {permission.canView && (
                        <span className="badge bg-green-100 text-green-800">
                          View
                        </span>
                      )}
                      {permission.canAdd && (
                        <span className="badge bg-blue-100 text-blue-800">
                          Add
                        </span>
                      )}
                      {permission.canEdit && (
                        <span className="badge bg-yellow-100 text-yellow-800">
                          Edit
                        </span>
                      )}
                      {permission.canDelete && (
                        <span className="badge bg-red-100 text-red-800">
                          Delete
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        permission.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {permission.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(permission)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(permission.permissionID)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">
              {currentPermission ? "Edit Permission" : "Create New Permission"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permission Name
                  </label>
                  <input
                    type="text"
                    name="permissionName"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.permissionName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="roleID"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.roleID}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.roleID} value={role.roleID}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Screen
                  </label>
                  <select
                    name="screenID"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.screenID}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Screen</option>
                    {screens.map((screen) => (
                      <option key={screen.screenID} value={screen.screenID}>
                        {screen.screenName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="canView"
                      checked={formData.canView}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Can View</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="canAdd"
                      checked={formData.canAdd}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Can Add</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="canEdit"
                      checked={formData.canEdit}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Can Edit</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="canDelete"
                      checked={formData.canDelete}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Can Delete</span>
                  </label>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    {currentPermission ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-green-500 text-white rounded-lg animate-fade-in-up">
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default PermissionsManager;
