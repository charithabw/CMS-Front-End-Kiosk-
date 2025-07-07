import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const ProductModal = ({ isOpen, onClose, product, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    productNameID: "",
    categoryID: "",
    prodEng: "",
    prodSin: "",
    prodTam: "",
    logo: "",
    logoPreview: "/default-product.png",
    backgroundImage: "",
    backgroundPreview: "/default-bg.jpg",
    titleEng: "",
    titleSin: "",
    titleTam: "",
    desEng: "",
    desSin: "",
    desTam: "",
    subTitleEng: "",
    subTitleSin: "",
    subTitleTam: "",
    pointListEng: "",
    pointListSin: "",
    pointListTam: "",
    lastModifiedBy: user?.username || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        productNameID: product.productNameID || "",
        categoryID: product.categoryID || "",
        prodEng: product.prodEng || "",
        prodSin: product.prodSin || "",
        prodTam: product.prodTam || "",
        logo: product.logo || "",
        logoPreview: product.logo || "/default-product.png",
        backgroundImage: product.backgroundImage || "",
        backgroundPreview: product.backgroundImage || "/default-bg.jpg",
        titleEng: product.titleEng || "",
        titleSin: product.titleSin || "",
        titleTam: product.titleTam || "",
        desEng: product.desEng || "",
        desSin: product.desSin || "",
        desTam: product.desTam || "",
        subTitleEng: product.subTitleEng || "",
        subTitleSin: product.subTitleSin || "",
        subTitleTam: product.subTitleTam || "",
        pointListEng: product.pointListEng || "",
        pointListSin: product.pointListSin || "",
        pointListTam: product.pointListTam || "",
        lastModifiedBy: user?.username || "",
      });
    } else {
      setFormData({
        productNameID: "",
        categoryID: product?.categoryID || "",
        prodEng: "",
        prodSin: "",
        prodTam: "",
        logo: "",
        logoPreview: "/default-product.png",
        backgroundImage: "",
        backgroundPreview: "/default-bg.jpg",
        titleEng: "",
        titleSin: "",
        titleTam: "",
        desEng: "",
        desSin: "",
        desTam: "",
        subTitleEng: "",
        subTitleSin: "",
        subTitleTam: "",
        pointListEng: "",
        pointListSin: "",
        pointListTam: "",
        lastModifiedBy: user?.username || "",
      });
    }
  }, [product, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        backgroundImage: file,
        backgroundPreview: URL.createObjectURL(file),
      }));
    } else if (e.target.value) {
      setFormData((prev) => ({
        ...prev,
        backgroundImage: e.target.value,
        backgroundPreview: e.target.value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {product?.productNameID ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">
                Basic Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English Name*
                </label>
                <input
                  type="text"
                  name="prodEng"
                  value={formData.prodEng}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sinhala Name*
                </label>
                <input
                  type="text"
                  name="prodSin"
                  value={formData.prodSin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamil Name*
                </label>
                <input
                  type="text"
                  name="prodTam"
                  value={formData.prodTam}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-lg border-b pb-2">Images</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded overflow-hidden border">
                    <img
                      src={formData.logoPreview || "/default-product.png"}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "/default-product.png";
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="text-sm text-gray-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded overflow-hidden border">
                    <img
                      src={formData.backgroundPreview || "/default-bg.jpg"}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/default-bg.jpg";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="backgroundImage"
                      value={typeof formData.backgroundImage === "string" ? formData.backgroundImage : ""}
                      onChange={handleBackgroundChange}
                      placeholder="Image URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundChange}
                      className="text-sm text-gray-500 w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              Titles & Descriptions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English Title
                </label>
                <input
                  type="text"
                  name="titleEng"
                  value={formData.titleEng}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sinhala Title
                </label>
                <input
                  type="text"
                  name="titleSin"
                  value={formData.titleSin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamil Title
                </label>
                <input
                  type="text"
                  name="titleTam"
                  value={formData.titleTam}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English Description
                </label>
                <textarea
                  name="desEng"
                  value={formData.desEng}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sinhala Description
                </label>
                <textarea
                  name="desSin"
                  value={formData.desSin}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamil Description
                </label>
                <textarea
                  name="desTam"
                  value={formData.desTam}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English Subtitle
                </label>
                <input
                  type="text"
                  name="subTitleEng"
                  value={formData.subTitleEng}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sinhala Subtitle
                </label>
                <input
                  type="text"
                  name="subTitleSin"
                  value={formData.subTitleSin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamil Subtitle
                </label>
                <input
                  type="text"
                  name="subTitleTam"
                  value={formData.subTitleTam}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English Features (one per line)
                </label>
                <textarea
                  name="pointListEng"
                  value={formData.pointListEng}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="• Feature 1\n• Feature 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sinhala Features (one per line)
                </label>
                <textarea
                  name="pointListSin"
                  value={formData.pointListSin}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="• Feature 1\n• Feature 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tamil Features (one per line)
                </label>
                <textarea
                  name="pointListTam"
                  value={formData.pointListTam}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="• Feature 1\n• Feature 2"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
