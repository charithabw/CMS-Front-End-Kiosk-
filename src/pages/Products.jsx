import React, { useState } from "react";
import { toast } from "react-toastify";

const initialProducts = [
  {
    productId: 1,
    productName: "Kiosk Stand",
    category: "Hardware",
    price: 100,
    isActive: true,
    createdDate: "2025-04-27",
    lastEditedBy: "admin",
  },
  {
    productId: 2,
    productName: "Touch Screen",
    category: "Hardware",
    price: 200,
    isActive: true,
    createdDate: "2025-04-27",
    lastEditedBy: "user1",
  },
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    productName: "",
    category: "",
    price: "",
    isActive: true,
  });
  const [editId, setEditId] = useState(null);

  const filtered = products.filter((p) =>
    p.productName.toLowerCase().includes(filter.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.productName || !form.category || !form.price)
      return toast.error("All fields required");
    if (editId) {
      setProducts(
        products.map((p) =>
          p.productId === editId ? { ...p, ...form, lastEditedBy: "admin" } : p
        )
      );
      toast.success("Product updated");
    } else {
      setProducts([
        ...products,
        {
          ...form,
          productId: products.length + 1,
          createdDate: new Date().toISOString(),
          lastEditedBy: "admin",
        },
      ]);
      toast.success("Product created");
    }
    setForm({ productName: "", category: "", price: "", isActive: true });
    setEditId(null);
  }

  function handleEdit(p) {
    setForm({
      productName: p.productName,
      category: p.category,
      price: p.price,
      isActive: p.isActive,
    });
    setEditId(p.productId);
  }

  function handleDelete(id) {
    setProducts(products.filter((p) => p.productId !== id));
    toast.success("Product deleted");
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <input
        className="border p-2 mb-2 mr-2"
        placeholder="Filter products..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input
          className="border p-2"
          placeholder="Product Name"
          value={form.productName}
          onChange={(e) =>
            setForm((f) => ({ ...f, productName: e.target.value }))
          }
        />
        <input
          className="border p-2"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
        <input
          className="border p-2"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          type="number"
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm((f) => ({ ...f, isActive: e.target.checked }))
            }
          />
          Active
        </label>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          type="submit"
        >
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => {
              setEditId(null);
              setForm({
                productName: "",
                category: "",
                price: "",
                isActive: true,
              });
            }}
            type="button"
          >
            Cancel
          </button>
        )}
      </form>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Active</th>
            <th className="p-2">Created</th>
            <th className="p-2">Last Edited By</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.productId}>
              <td className="p-2">{p.productId}</td>
              <td className="p-2">{p.productName}</td>
              <td className="p-2">{p.category}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.isActive ? "Yes" : "No"}</td>
              <td className="p-2">{p.createdDate}</td>
              <td className="p-2">{p.lastEditedBy}</td>
              <td className="p-2">
                <button
                  className="text-blue-500 mr-2"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(p.productId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
