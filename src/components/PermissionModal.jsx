import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const PermissionModal = ({ isOpen, onClose, permission, onSubmit, user, roles, screens }) => {
  const [formData, setFormData] = useState({
    permissionName: "",
    permissionCode: "",
    screenID: "",
    roleID: "",
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canView: true,
    isActive: true,
    createdBy: user?.userId || 1,
    modifiedBy: user?.userId || 1,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (permission) {
      setFormData({
        permissionName: permission.permissionName || "",
        permissionCode: permission.permissionCode || "",
        screenID: permission.screenID || "",
        roleID: permission.roleID || "",
        canAdd: permission.canAdd || false,
        canEdit: permission.canEdit || false,
        canDelete: permission.canDelete || false,
        canView: permission.canView !== undefined ? permission.canView : true,
        isActive: permission.isActive !== undefined ? permission.isActive : true,
        createdBy: permission.createdBy || user?.userId || 1,
        modifiedBy: user?.userId || 1,
      });
    } else {
      setFormData({
        permissionName: "",
        permissionCode: "",
        screenID: "",
        roleID: "",
        canAdd: false,
        canEdit: false,
        canDelete: false,
        canView: true,
        isActive: true,
        createdBy: user?.userId || 1,
        modifiedBy: user?.userId || 1,
      });
    }
    setErrors({});
  }, [permission, user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.permissionName || formData.permissionName.trim() === "") {
      newErrors.permissionName = "Permission name is required";
    }
    if (!formData.permissionCode || formData.permissionCode.trim() === "") {
      newErrors.permissionCode = "Permission code is required";
    }
    if (!formData.screenID) {
      newErrors.screenID = "Screen is required";
    }
    if (!formData.roleID) {
      newErrors.roleID = "Role is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Convert screenID and roleID to numbers for backend
      await onSubmit({
        ...formData,
        screenID: Number(formData.screenID),
        roleID: Number(formData.roleID),
      });
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save permission");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {permission ? "Edit Permission" : "Add Permission"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permission Name *
            </label>
            <input
              type="text"
              name="permissionName"
              value={formData.permissionName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.permissionName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter permission name"
              maxLength={100}
            />
            {errors.permissionName && (
              <p className="text-red-500 text-sm mt-1">{errors.permissionName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permission Code *
            </label>
            <input
              type="text"
              name="permissionCode"
              value={formData.permissionCode}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.permissionCode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter permission code"
              maxLength={100}
            />
            {errors.permissionCode && (
              <p className="text-red-500 text-sm mt-1">{errors.permissionCode}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Screen *
              </label>
              <select
                name="screenID"
                value={formData.screenID}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.screenID ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="">Select a screen</option>
                {screens.map((screen) => (
                  <option key={screen.screenID} value={screen.screenID}>
                    {screen.screenName}
                  </option>
                ))}
              </select>
              {errors.screenID && (
                <p className="text-red-500 text-sm mt-1">{errors.screenID}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <select
                name="roleID"
                value={formData.roleID}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.roleID ? "border-red-500" : "border-gray-300"
                }`}
                required
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.roleID} value={role.roleID}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              {errors.roleID && (
                <p className="text-red-500 text-sm mt-1">{errors.roleID}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Permissions</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canAdd"
                  name="canAdd"
                  checked={formData.canAdd}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="canAdd" className="ml-2 text-sm text-gray-700">
                  Can Add
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canEdit"
                  name="canEdit"
                  checked={formData.canEdit}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="canEdit" className="ml-2 text-sm text-gray-700">
                  Can Edit
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canDelete"
                  name="canDelete"
                  checked={formData.canDelete}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="canDelete" className="ml-2 text-sm text-gray-700">
                  Can Delete
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canView"
                  name="canView"
                  checked={formData.canView}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="canView" className="ml-2 text-sm text-gray-700">
                  Can View
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : permission ? "Update" : "Save"}
            </button>
          </div>
        </form>
        {user && (
          <div className="mt-4 text-sm text-gray-500">
            Action will be performed by: {user.username}
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionModal; 