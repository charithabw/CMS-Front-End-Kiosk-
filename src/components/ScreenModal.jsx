import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ScreenModal = ({ isOpen, onClose, screen, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    screenCode: "",
    screenName: "",
    isActive: true,
    createdDate: new Date().toISOString(),
    modifiedBy: user?.userId || 1,
    createdBy: user?.userId || 1,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (screen) {
      setFormData({
        screenCode: screen.screenCode || "",
        screenName: screen.screenName || "",
        isActive: screen.isActive !== undefined ? screen.isActive : true,
        createdDate: screen.createdDate || new Date().toISOString(),
        modifiedBy: user?.userId || 1,
        createdBy: user?.userId || 1,
      });
    } else {
      setFormData({
        screenCode: "",
        screenName: "",
        isActive: true,
        //createdDate: new Date().toISOString(),
        modifiedBy: user?.userId || 1,
        createdBy: user?.userId || 1,
      });
    }
    setErrors({});
  }, [screen, user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.screenCode || formData.screenCode.trim() === "") {
      newErrors.screenCode = "Screen code is required";
    } else if (formData.screenCode.length > 20) {
      newErrors.screenCode = "Screen code is too long (max 20)";
    }
    if (!formData.screenName || formData.screenName.trim() === "") {
      newErrors.screenName = "Screen name is required";
    } else if (formData.screenName.length > 100) {
      newErrors.screenName = "Screen name is too long (max 100)";
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
      toast.error(error.message || "Failed to save screen");
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
            {screen ? "Edit Screen" : "Add Screen"}
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
              Screen Code *
            </label>
            <input
              type="text"
              name="screenCode"
              value={formData.screenCode}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.screenCode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter screen code"
              maxLength={20}
            />
            {errors.screenCode && (
              <p className="text-red-500 text-sm mt-1">{errors.screenCode}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Screen Name *
            </label>
            <input
              type="text"
              name="screenName"
              value={formData.screenName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.screenName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter screen name"
              maxLength={100}
            />
            {errors.screenName && (
              <p className="text-red-500 text-sm mt-1">{errors.screenName}</p>
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
              {isSubmitting ? "Saving..." : screen ? "Update" : "Save"}
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

export default ScreenModal;
