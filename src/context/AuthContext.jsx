// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CommonPost } from "../common/httpClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch("https://localhost:7037/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log("Login response:", data); // Keep this for debugging

      if (data.status === "Success") {
        const userData = {
          userId: data.userId, // lowercase 'userId' in response
          username: data.username, // lowercase 'username' in response
          roleId: data.roleID, // lowercase 'roleID' in response (note the 'ID' is uppercase)
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Login successful!");
        return true;
      } else {
        toast.error("Login failed. Please check your credentials.");
        return false;
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during login");
      return false;
    }
  };

  /* const login = async (credentials) => {
    try {
      const response = await CommonPost("login", credentials);

      if (response.status === "Success") {
        const userData = {
          userId: response.UserId,
          username: response.Username,
          roleId: response.RoleID,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Login successful!");
        return true;
      } else {
        toast.error("Login failed. Please check your credentials.");
        return false;
      }
    } catch (error) {
      toast.error(error.message || "An error occurred during login");
      return false;
    }
  };
  
*/
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const hasRole = (roleId) => {
    return user?.roleId === roleId;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
