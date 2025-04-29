import React, { useState } from "react";
import { toast } from "react-toastify";

const initialScreens = [
  {
    screenId: 1,
    screenCode: "USR",
    screenName: "Users",
    isActive: true,
    createdDate: "2025-04-27",
    lastEditedBy: "admin",
  },
  {
    screenId: 2,
    screenCode: "PRD",
    screenName: "Products",
    isActive: true,
    createdDate: "2025-04-27",
    lastEditedBy: "admin",
  },
];

export default function Screens() {
  const [screens, setScreens] = useState(initialScreens);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    screenCode: "",
    screenName: "",
    isActive: true,
  });
  const [editId, setEditId] = useState(null);

  const filtered = screens.filter((s) =>
    s.screenName.toLowerCase().includes(filter.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.screenCode || !form.screenName)
      return toast.error("All fields required");
    if (editId) {
      setScreens(
        screens.map((s) =>
          s.screenId === editId ? { ...s, ...form, lastEditedBy: "admin" } : s
        )
      );
      toast.success("Screen updated");
    } else {
      setScreens([
        ...screens,
        {
          ...form,
          screenId: screens.length + 1,
          createdDate: new Date().toISOString(),
          lastEditedBy: "admin",
        },
      ]);
      toast.success("Screen created");
    }
    setForm({ screenCode: "", screenName: "", isActive: true });
    setEditId(null);
  }

  function handleEdit(s) {
    setForm({
      screenCode: s.screenCode,
      screenName: s.screenName,
      isActive: s.isActive,
    });
    setEditId(s.screenId);
  }

  function handleDelete(id) {
    setScreens(screens.filter((s) => s.screenId !== id));
    toast.success("Screen deleted");
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Screens</h2>
      <input
        className="border p-2 mb-2 mr-2"
        placeholder="Filter screens..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          className="border p-2"
          placeholder="Screen Code"
          value={form.screenCode}
          onChange={(e) =>
            setForm((f) => ({ ...f, screenCode: e.target.value }))
          }
        />
        <input
          className="border p-2"
          placeholder="Screen Name"
          value={form.screenName}
          onChange={(e) =>
            setForm((f) => ({ ...f, screenName: e.target.value }))
          }
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
              setForm({ screenCode: "", screenName: "", isActive: true });
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
            <th className="p-2 text-black">ID</th>
            <th className="p-2 text-black">Code</th>
            <th className="p-2 text-black">Name</th>
            <th className="p-2 text-black">Active</th>
            <th className="p-2 text-black">Created</th>
            <th className="p-2 text-black">Last Edited By</th>
            <th className="p-2 text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.screenId}>
              <td className="p-2 text-black">{s.screenId}</td>
              <td className="p-2 text-black">{s.screenCode}</td>
              <td className="p-2 text-black">{s.screenName}</td>
              <td className="p-2 text-black">{s.isActive ? "Yes" : "No"}</td>
              <td className="p-2 text-black">{s.createdDate}</td>
              <td className="p-2 text-black">{s.lastEditedBy}</td>
              <td className="p-2 ">
                <button
                  className="text-blue-500 mr-2"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(s.screenId)}
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
