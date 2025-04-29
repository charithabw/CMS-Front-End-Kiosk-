import React, { useState } from "react";
import { toast } from "react-toastify";

const initialPermissions = [
  {
    permissionId: 1,
    permissionName: "Add User",
    permissionCode: "user-add",
    screenId: 1,
    roleId: 1,
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canView: true,
    isActive: true,
    createdDate: "2025-04-27",
    lastEditedBy: "admin",
  },
];

export default function Permissions() {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    permissionName: "",
    permissionCode: "",
    screenId: "",
    roleId: "",
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canView: true,
    isActive: true,
  });
  const [editId, setEditId] = useState(null);

  const filtered = permissions.filter((p) =>
    p.permissionName.toLowerCase().includes(filter.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.permissionName || !form.permissionCode)
      return toast.error("Name and code required");
    if (editId) {
      setPermissions(
        permissions.map((p) =>
          p.permissionId === editId
            ? { ...p, ...form, lastEditedBy: "admin" }
            : p
        )
      );
      toast.success("Permission updated");
    } else {
      setPermissions([
        ...permissions,
        {
          ...form,
          permissionId: permissions.length + 1,
          createdDate: new Date().toISOString(),
          lastEditedBy: "admin",
        },
      ]);
      toast.success("Permission created");
    }
    setForm({
      permissionName: "",
      permissionCode: "",
      screenId: "",
      roleId: "",
      canAdd: false,
      canEdit: false,
      canDelete: false,
      canView: true,
      isActive: true,
    });
    setEditId(null);
  }

  function handleEdit(p) {
    setForm({ ...p });
    setEditId(p.permissionId);
  }

  function handleDelete(id) {
    setPermissions(permissions.filter((p) => p.permissionId !== id));
    toast.success("Permission deleted");
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Permissions</h2>
      <input
        className="border p-2 mb-2 mr-2"
        placeholder="Filter permissions..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 flex-wrap">
        <input
          className="border p-2"
          placeholder="Permission Name"
          value={form.permissionName}
          onChange={(e) =>
            setForm((f) => ({ ...f, permissionName: e.target.value }))
          }
        />
        <input
          className="border p-2"
          placeholder="Permission Code"
          value={form.permissionCode}
          onChange={(e) =>
            setForm((f) => ({ ...f, permissionCode: e.target.value }))
          }
        />
        <input
          className="border p-2"
          placeholder="Screen ID"
          value={form.screenId}
          onChange={(e) => setForm((f) => ({ ...f, screenId: e.target.value }))}
          type="number"
        />
        <input
          className="border p-2"
          placeholder="Role ID"
          value={form.roleId}
          onChange={(e) => setForm((f) => ({ ...f, roleId: e.target.value }))}
          type="number"
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={form.canAdd}
            onChange={(e) =>
              setForm((f) => ({ ...f, canAdd: e.target.checked }))
            }
          />
          Add
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={form.canEdit}
            onChange={(e) =>
              setForm((f) => ({ ...f, canEdit: e.target.checked }))
            }
          />
          Edit
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={form.canDelete}
            onChange={(e) =>
              setForm((f) => ({ ...f, canDelete: e.target.checked }))
            }
          />
          Delete
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={form.canView}
            onChange={(e) =>
              setForm((f) => ({ ...f, canView: e.target.checked }))
            }
          />
          View
        </label>
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
                permissionName: "",
                permissionCode: "",
                screenId: "",
                roleId: "",
                canAdd: false,
                canEdit: false,
                canDelete: false,
                canView: true,
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
          <tr className="bg-gray-100  text-black">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Code</th>
            <th className="p-2">Screen</th>
            <th className="p-2">Role</th>
            <th className="p-2">Add</th>
            <th className="p-2">Edit</th>
            <th className="p-2">Delete</th>
            <th className="p-2">View</th>
            <th className="p-2">Active</th>
            <th className="p-2">Last Edited By</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.permissionId} className=" text-black">
              <td className="p-2">{p.permissionId}</td>
              <td className="p-2">{p.permissionName}</td>
              <td className="p-2">{p.permissionCode}</td>
              <td className="p-2">{p.screenId}</td>
              <td className="p-2">{p.roleId}</td>
              <td className="p-2">{p.canAdd ? "✔" : ""}</td>
              <td className="p-2">{p.canEdit ? "✔" : ""}</td>
              <td className="p-2">{p.canDelete ? "✔" : ""}</td>
              <td className="p-2">{p.canView ? "✔" : ""}</td>
              <td className="p-2">{p.isActive ? "✔" : ""}</td>
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
                  onClick={() => handleDelete(p.permissionId)}
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
