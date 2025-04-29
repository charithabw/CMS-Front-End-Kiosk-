import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TopBar from "../components/TopBar";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import UserForm from "../components/forms/UserForm";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  const columns = [
    { header: "ID", accessor: "userId" },
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    {
      header: "Is Locked",
      accessor: "isLock",
      cell: (value) => (value ? "Yes" : "No"),
    },
    { header: "Role", accessor: "roleName" },
    { header: "Created Date", accessor: "createdDate" },
    { header: "Actions", accessor: "actions" },
  ];

  useEffect(() => {
    // Simulate API call to fetch users
    setTimeout(() => {
      const dummyUsers = [
        {
          userId: 1,
          username: "user1",
          passwordHash: "24c9e15e52afc...",
          email: "user1@gmail.com",
          isLock: false,
          lockCount: null,
          createdDate: "2025-04-20 10:30:00",
          roleId: 1,
          roleName: "ADMIN",
        },
        {
          userId: 2,
          username: "user2",
          passwordHash: "5f4dcc3b5aa765...",
          email: "user2@gmail.com",
          isLock: false,
          lockCount: null,
          createdDate: "2025-04-21 14:20:00",
          roleId: 2,
          roleName: "EDITOR",
        },
      ];

      setUsers(dummyUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // Simulate API call to delete user
      setTimeout(() => {
        setUsers(users.filter((user) => user.userId !== userId));
        toast.success("User deleted successfully");

        // In a real application, you would track this action
        logUserAction("Deleted user");
      }, 500);
    }
  };

  const handleSubmitUser = (userData) => {
    // Simulate API call to add/update user
    setTimeout(() => {
      if (currentUser) {
        // Update existing user
        setUsers(
          users.map((user) =>
            user.userId === currentUser.userId ? { ...user, ...userData } : user
          )
        );
        toast.success("User updated successfully");
        logUserAction("Updated user");
      } else {
        // Add new user
        const newUser = {
          userId: users.length + 1,
          ...userData,
          createdDate: new Date().toISOString(),
          roleName:
            userData.roleId === 1
              ? "ADMIN"
              : userData.roleId === 2
              ? "EDITOR"
              : "USER",
        };
        setUsers([...users, newUser]);
        toast.success("User added successfully");
        logUserAction("Added new user");
      }

      setIsModalOpen(false);
    }, 500);
  };

  const logUserAction = (action) => {
    // In a real application, this would send the action to the server
    const currentUser = JSON.parse(localStorage.getItem("user")) || {
      username: "Admin",
    };
    console.log(
      `User ${
        currentUser.username
      } performed action: ${action} at ${new Date().toISOString()}`
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
      user.roleName.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="User Management" />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Filter users..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add User
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredUsers}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? "Edit User" : "Add User"}
      >
        <UserForm
          user={currentUser}
          onSubmit={handleSubmitUser}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Users;
