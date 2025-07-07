import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const RoleModal = ({ isOpen, onClose, role, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    roleName: "",
    isActive: true,
    createdBy: user?.userId || 1,
    modifiedBy: user?.userId || 1,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        roleName: role.roleName || "",
        isActive: role.isActive !== undefined ? role.isActive : true,
        createdBy: role.createdBy || user?.userId || 1,
        modifiedBy: user?.userId || 1,
      });
    } else {
      setFormData({
        roleName: "",
        isActive: true,
        createdBy: user?.userId || 1,
        modifiedBy: user?.userId || 1,
      });
    }
    setErrors({});
  }, [role, user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.roleName || formData.roleName.trim() === "") {
      newErrors.roleName = "Role name is required";
    } else if (formData.roleName.length > 100) {
      newErrors.roleName = "Role name is too long (max 100)";
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
      await onSubmit({ ...formData });
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save role");
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
            {role ? "Edit Role" : "Add Role"}
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
              Role Name *
            </label>
            <input
              type="text"
              name="roleName"
              value={formData.roleName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.roleName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter role name"
              maxLength={100}
            />
            {errors.roleName && (
              <p className="text-red-500 text-sm mt-1">{errors.roleName}</p>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Active</label>
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
              {isSubmitting ? "Saving..." : role ? "Update" : "Save"}
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

export default RoleModal; 