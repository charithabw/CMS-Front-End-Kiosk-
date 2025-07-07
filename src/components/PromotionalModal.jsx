import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { CommonPostFormData } from "../common/httpClient";

const promotionalSchema = z.object({
  promotionalName: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name is too long"),
  promotionalDesc: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
  image: z.any().optional(),
  isActive: z.boolean().default(true),
  status: z.string().max(255, "Status is too long").optional(),
});

const PromotionalModal = ({ isOpen, onClose, promotional, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    promotionalName: "",
    promotionalDesc: "",
    imagePath: "",
    imagePreview: "/default-category.png",
    isActive: true,
    status: "",
    createdBy: user?.userId || 1,
    modifiedBy: user?.userId || 1,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (promotional) {
      setFormData({
        promotionalName: promotional.promotionalName || "",
        promotionalDesc: promotional.promotionalDesc || "",
        imagePath: promotional.imagePath || "",
        imagePreview: promotional.imagePath || "/default-category.png",
        isActive: promotional.isActive !== undefined ? promotional.isActive : true,
        status: promotional.status || "",
        createdBy: promotional.createdBy || user?.userId || 1,
        modifiedBy: user?.userId || 1,
      });
    } else {
      setFormData({
        promotionalName: "",
        promotionalDesc: "",
        imagePath: "",
        imagePreview: "/default-category.png",
        isActive: true,
        status: "",
        createdBy: user?.userId || 1,
        modifiedBy: user?.userId || 1,
      });
    }
    setErrors({});
  }, [promotional, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Only image files are allowed",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      try {
        const data = await CommonPostFormData("upload", uploadFormData);
        if (data.imagePath) {
          setFormData((prev) => ({
            ...prev,
            imagePath: data.imagePath,
            imagePreview: URL.createObjectURL(file),
          }));
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.image;
            return newErrors;
          });
        } else {
          setErrors((prev) => ({
            ...prev,
            image: "No image path returned from server",
          }));
        }
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          image: "Failed to upload image",
        }));
      }
    }
  };

  const validateForm = () => {
    try {
      promotionalSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const dataToSend = {
        promotionalName: formData.promotionalName,
        promotionalDesc: formData.promotionalDesc,
        imagePath: formData.imagePath,
        isActive: formData.isActive,
        status: formData.status,
        createdBy: formData.createdBy,
        modifiedBy: formData.modifiedBy,
      };
      await onSubmit(dataToSend);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save promotional");
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
            {promotional ? "Edit Promotional" : "Add Promotional"}
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
              Name *
            </label>
            <input
              type="text"
              name="promotionalName"
              value={formData.promotionalName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.promotionalName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter promotional name"
            />
            {errors.promotionalName && (
              <p className="text-red-500 text-sm mt-1">{errors.promotionalName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="promotionalDesc"
              value={formData.promotionalDesc}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.promotionalDesc ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter description"
              rows={3}
            />
            {errors.promotionalDesc && (
              <p className="text-red-500 text-sm mt-1">{errors.promotionalDesc}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotional Image
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-md border"
                onError={(e) => {
                  e.target.src = "/default-category.png";
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter status (optional)"
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status}</p>
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
              {isSubmitting ? "Saving..." : promotional ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionalModal;
