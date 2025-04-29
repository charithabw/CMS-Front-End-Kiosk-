import React from "react";
import { useState } from "react";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Data:", formData);
    // Handle form submission (e.g., send to backend)
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block font-medium">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 w-full border rounded p-2"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-24 w-24 object-cover rounded"
            />
          )}
        </div>

        {/* Product Name */}
        <div>
          <label className="block font-medium">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Kitchen</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium">Price ($)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded p-2"
            placeholder="Enter price"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows="3"
            placeholder="Enter product description"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
