import React, { useState } from "react";
import { toast } from "react-toastify";

const initialRoles = [
  {
    roleId: 1,
    roleName: "ADMIN",
    isActive: true,
    createdDate: "2025-04-27",
    lastEditedBy: "user1",
  },
  {
    roleId: 2,
    roleName: "EDITOR",
    isActive: true,
    createdDate: "2025-04-27",
    lastEditedBy: "admin",
  },
];

export default function Roles() {
  const [roles, setRoles] = useState(initialRoles);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({ roleName: "", isActive: true });
  const [editId, setEditId] = useState(null);

  const filtered = roles.filter((r) =>
    r.roleName.toLowerCase().includes(filter.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.roleName) return toast.error("Role name required");
    if (editId) {
      setRoles(
        roles.map((r) =>
          r.roleId === editId ? { ...r, ...form, lastEditedBy: "admin" } : r
        )
      );
      toast.success("Role updated");
    } else {
      setRoles([
        ...roles,
        {
          ...form,
          roleId: roles.length + 1,
          createdDate: new Date().toISOString(),
          lastEditedBy: "admin",
        },
      ]);
      toast.success("Role created");
    }
    setForm({ roleName: "", isActive: true });
    setEditId(null);
  }

  function handleEdit(r) {
    setForm({ roleName: r.roleName, isActive: r.isActive });
    setEditId(r.roleId);
  }

  function handleDelete(id) {
    setRoles(roles.filter((r) => r.roleId !== id));
    toast.success("Role deleted");
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Roles</h2>
      <input
        className="border p-2 mb-2 mr-2"
        placeholder="Filter roles..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          className="border p-2 bg-gray-200 rounded"
          placeholder="Role Name"
          value={form.roleName}
          onChange={(e) => setForm((f) => ({ ...f, roleName: e.target.value }))}
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
              setForm({ roleName: "", isActive: true });
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
            <th className="p-2 text-black">Role Name</th>
            <th className="p-2 text-black">Active</th>
            <th className="p-2 text-black">Created</th>
            <th className="p-2 text-black">Last Edited By</th>
            <th className="p-2 text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.roleId}>
              <td className="p-2 text-black">{r.roleId}</td>
              <td className="p-2 text-black">{r.roleName}</td>
              <td className="p-2 text-black">{r.isActive ? "Yes" : "No"}</td>
              <td className="p-2 text-black">{r.createdDate}</td>
              <td className="p-2 text-black">{r.lastEditedBy}</td>
              <td className="p-2">
                <button
                  className="text-blue-500 mr-2"
                  onClick={() => handleEdit(r)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(r.roleId)}
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
