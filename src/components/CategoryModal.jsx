import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { z } from "zod";
import { CommonPostFormData } from "../common/httpClient";

const categorySchema = z.object({
  catEng: z
    .string()
    .min(1, "English name is required")
    .max(255, "English name is too long"),
  catSin: z
    .string()
    .min(1, "Sinhala name is required")
    .max(255, "Sinhala name is too long"),
  catTam: z
    .string()
    .min(1, "Tamil name is required")
    .max(255, "Tamil name is too long"),
  image: z.any().optional(),
  isActive: z.boolean().default(true),
});

const CategoryModal = ({ isOpen, onClose, category, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    catEng: "",
    catSin: "",
    catTam: "",
    imagePath: "",
    imagePreview: "/default-category.png",
    isActive: true,
    createdBy: user?.userId || 1,
    modifiedBy: user?.userId || 1,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        catEng: category.catEng || "",
        catSin: category.catSin || "",
        catTam: category.catTam || "",
        imagePath: category.imagePath || "",
        imagePreview: category.imagePath || "/default-category.png",
        isActive: category.isActive !== undefined ? category.isActive : true,
        createdBy: category.createdBy || user?.userId || 1,
        modifiedBy: user?.userId || 1,
      });
    } else {
      setFormData({
        catEng: "",
        catSin: "",
        catTam: "",
        imagePath: "",
        imagePreview: "/default-category.png",
        isActive: true,
        createdBy: user?.userId || 1,
        modifiedBy: user?.userId || 1,
      });
    }
    setErrors({});
  }, [category, user]);

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

      // Upload to backend using shared API client
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
      categorySchema.parse(formData);
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
        catEng: formData.catEng,
        catSin: formData.catSin,
        catTam: formData.catTam,
        imagePath: formData.imagePath,
        isActive: formData.isActive,
        createdBy: formData.createdBy,
        modifiedBy: formData.modifiedBy,
      };

      await onSubmit(dataToSend);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save category");
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
            {category ? "Edit Category" : "Add Category"}
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
              English Name *
            </label>
            <input
              type="text"
              name="catEng"
              value={formData.catEng}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.catEng ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter English name"
            />
            {errors.catEng && (
              <p className="text-red-500 text-sm mt-1">{errors.catEng}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sinhala Name *
            </label>
            <input
              type="text"
              name="catSin"
              value={formData.catSin}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.catSin ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Sinhala name"
            />
            {errors.catSin && (
              <p className="text-red-500 text-sm mt-1">{errors.catSin}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamil Name *
            </label>
            <input
              type="text"
              name="catTam"
              value={formData.catTam}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.catTam ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Tamil name"
            />
            {errors.catTam && (
              <p className="text-red-500 text-sm mt-1">{errors.catTam}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Image
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
              {isSubmitting ? "Saving..." : category ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
