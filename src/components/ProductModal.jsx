import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CommonPostFormData } from "../common/httpClient";

const ProductModal = ({
  isOpen,
  onClose,
  product,
  onSubmit,
  user,
  categoryID,
}) => {
  const [formData, setFormData] = useState({
    productDetailID: "",
    productNameID: "",
    productImageID: "",
    prodEng: "",
    prodSin: "",
    prodTam: "",
    isActive: true,
    logo: "",
    logoPreview: "/default-product.png",
    backgroundImage: "",
    backgroundPreview: "/default-bg.jpg",
    qrAndroid: "",
    qrAndroidPreview: "/default-qr.png",
    qrApple: "",
    qrApplePreview: "/default-qr.png",
    qrHuawei: "",
    qrHuaweiPreview: "/default-qr.png",
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
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      console.log("product detai", product);
      setFormData({
        productDetailID: product.productDetailID || "",
        productNameID: product.productNameID || "",
        productImageID: product.productImageID || "",
        prodEng: product.prodEng || "",
        prodSin: product.prodSin || "",
        prodTam: product.prodTam || "",
        isActive: product.isActive !== undefined ? product.isActive : true,
        logo: product.logo || "",
        logoPreview: product.logo || "/default-product.png",
        backgroundImage: product.backgroundImage || "",
        backgroundPreview: product.backgroundImage || "/default-bg.jpg",
        qrAndroid: product.qrAndroid || "",
        qrAndroidPreview: product.qrAndroid || "/default-qr.png",
        qrApple: product.qrApple || "",
        qrApplePreview: product.qrApple || "/default-qr.png",
        qrHuawei: product.qrHuawei || "",
        qrHuaweiPreview: product.qrHuawei || "/default-qr.png",
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
      });
    } else {
      setFormData({
        productDetailID: "",
        productNameID: "",
        productImageID: "",
        prodEng: "",
        prodSin: "",
        prodTam: "",
        isActive: true,
        logo: "",
        logoPreview: "/default-product.png",
        backgroundImage: "",
        backgroundPreview: "/default-bg.jpg",
        qrAndroid: "",
        qrAndroidPreview: "/default-qr.png",
        qrApple: "",
        qrApplePreview: "/default-qr.png",
        qrHuawei: "",
        qrHuaweiPreview: "/default-qr.png",
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
      });
    }
    setErrors({});
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.prodEng.trim())
      newErrors.prodEng = "English name is required";
    if (!formData.prodSin.trim())
      newErrors.prodSin = "Sinhala name is required";
    if (!formData.prodTam.trim()) newErrors.prodTam = "Tamil name is required";
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

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          logo: "Only image files are allowed",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          logo: "Image size must be less than 5MB",
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
            logo: data.imagePath,
            logoPreview: URL.createObjectURL(file),
          }));
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.logo;
            return newErrors;
          });
        } else {
          setErrors((prev) => ({
            ...prev,
            logo: "No image path returned from server",
          }));
        }
      } catch (err) {
        setErrors((prev) => ({ ...prev, logo: "Failed to upload image" }));
      }
    }
  };

  const handleBackgroundChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          backgroundImage: "Only image files are allowed",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          backgroundImage: "Image size must be less than 5MB",
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
            backgroundImage: data.imagePath,
            backgroundPreview: URL.createObjectURL(file),
          }));
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.backgroundImage;
            return newErrors;
          });
        } else {
          setErrors((prev) => ({
            ...prev,
            backgroundImage: "No image path returned from server",
          }));
        }
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          backgroundImage: "Failed to upload image",
        }));
      }
    }
  };

  const handleQrAndroidChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          qrAndroid: "Only image files are allowed",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          qrAndroid: "Image size must be less than 5MB",
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
            qrAndroid: data.imagePath,
            qrAndroidPreview: URL.createObjectURL(file),
          }));
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.qrAndroid;
            return newErrors;
          });
        } else {
          setErrors((prev) => ({
            ...prev,
            qrAndroid: "No image path returned from server",
          }));
        }
      } catch (err) {
        setErrors((prev) => ({ ...prev, qrAndroid: "Failed to upload image" }));
      }
    }
  };

  const handleQrAppleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          qrApple: "Only image files are allowed",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          qrApple: "Image size must be less than 5MB",
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
            qrApple: data.imagePath,
            qrApplePreview: URL.createObjectURL(file),
          }));
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.qrApple;
            return newErrors;
          });
        } else {
          setErrors((prev) => ({
            ...prev,
            qrApple: "No image path returned from server",
          }));
        }
      } catch (err) {
        setErrors((prev) => ({ ...prev, qrApple: "Failed to upload image" }));
      }
    }
  };

  const handleQrHuaweiChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          qrHuawei: "Only image files are allowed",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          qrHuawei: "Image size must be less than 5MB",
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
            qrHuawei: data.imagePath,
            qrHuaweiPreview: URL.createObjectURL(file),
          }));
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.qrHuawei;
            return newErrors;
          });
        } else {
          setErrors((prev) => ({
            ...prev,
            qrHuawei: "No image path returned from server",
          }));
        }
      } catch (err) {
        setErrors((prev) => ({ ...prev, qrHuawei: "Failed to upload image" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Compose data for all three APIs
      const productNameData = {
        productNameID: formData.productNameID || undefined,
        categoryID: categoryID,
        prodEng: formData.prodEng,
        prodSin: formData.prodSin,
        prodTam: formData.prodTam,
        isActive: formData.isActive,
        createdBy: user?.userId || 1,
        modifiedBy: user?.userId || 1,
      };
      const productImageData = {
        productImageID: formData.productImageID || undefined,
        productNameID: formData.productNameID || undefined,
        logo: formData.logo || "",
        qrAndroid: formData.qrAndroid || "",
        qrApple: formData.qrApple || "",
        qrHuawei: formData.qrHuawei || "",
        backgroundImage: formData.backgroundImage || "",
        isActive: formData.isActive,
        createdBy: user?.userId || 1,
        modifiedBy: user?.userId || 1,
      };
      const productDetailData = {
        productDetailID: formData.productDetailID || undefined,
        productNameID: formData.productNameID || undefined,
        titleEng: formData.titleEng,
        titleSin: formData.titleSin,
        titleTam: formData.titleTam,
        desEng: formData.desEng,
        desSin: formData.desSin,
        desTam: formData.desTam,
        subTitleEng: formData.subTitleEng,
        subTitleSin: formData.subTitleSin,
        subTitleTam: formData.subTitleTam,
        pointListEng: formData.pointListEng,
        pointListSin: formData.pointListSin,
        pointListTam: formData.pointListTam,
        isActive: formData.isActive,
        createdBy: user?.userId || 1,
        modifiedBy: user?.userId || 1,
      };
      await onSubmit({ productNameData, productImageData, productDetailData });
      onClose();
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
                  className={`w-full px-3 py-2 border rounded ${
                    errors.prodEng ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.prodEng && (
                  <p className="text-red-500 text-sm mt-1">{errors.prodEng}</p>
                )}
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
                  className={`w-full px-3 py-2 border rounded ${
                    errors.prodSin ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.prodSin && (
                  <p className="text-red-500 text-sm mt-1">{errors.prodSin}</p>
                )}
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
                  className={`w-full px-3 py-2 border rounded ${
                    errors.prodTam ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.prodTam && (
                  <p className="text-red-500 text-sm mt-1">{errors.prodTam}</p>
                )}
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
                {errors.logo && (
                  <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
                )}
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundChange}
                    className="text-sm text-gray-500"
                  />
                </div>
                {errors.backgroundImage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.backgroundImage}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Android
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded overflow-hidden border">
                    <img
                      src={formData.qrAndroidPreview || "/default-qr.png"}
                      alt="QR Android preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "/default-qr.png";
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrAndroidChange}
                    className="text-sm text-gray-500"
                  />
                </div>
                {errors.qrAndroid && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.qrAndroid}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Apple
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded overflow-hidden border">
                    <img
                      src={formData.qrApplePreview || "/default-qr.png"}
                      alt="QR Apple preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "/default-qr.png";
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrAppleChange}
                    className="text-sm text-gray-500"
                  />
                </div>
                {errors.qrApple && (
                  <p className="text-red-500 text-sm mt-1">{errors.qrApple}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Huawei
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded overflow-hidden border">
                    <img
                      src={formData.qrHuaweiPreview || "/default-qr.png"}
                      alt="QR Huawei preview"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.src = "/default-qr.png";
                      }}
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrHuaweiChange}
                    className="text-sm text-gray-500"
                  />
                </div>
                {errors.qrHuawei && (
                  <p className="text-red-500 text-sm mt-1">{errors.qrHuawei}</p>
                )}
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
