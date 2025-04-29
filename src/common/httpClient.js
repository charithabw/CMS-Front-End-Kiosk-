import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7037/api/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // For sending cookies (e.g., auth tokens)
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "en-US",
  },
});

// Handle token expiration globally
const handleTokenExpiration = (response) => {
  if (response.data === "Token Time Exceed") {
    console.warn("Token expired, logging out...");
    // Add logout logic here (e.g., redirect to login)
  }
};

/**
 * GET request
 * @param {string} url - Endpoint
 * @param {object|null} params - Query parameters (optional)
 * @returns {Promise<object>} - API response data
 */
export const CommonGet = async (url, params = null) => {
  try {
    const response = await apiClient.get(url, { params });
    handleTokenExpiration(response);
    return response.data;
  } catch (error) {
    console.error("GET Error:", error);
    throw error;
  }
};

/**
 * POST request
 * @param {string} url - Endpoint
 * @param {object|null} data - Request body (optional)
 * @param {object|null} params - Query parameters (optional)
 * @returns {Promise<object>} - API response data
 */
export const CommonPost = async (url, data = null, params = null) => {
  try {
    const response = await apiClient.post(url, data, { params });
    handleTokenExpiration(response);
    return response.data;
  } catch (error) {
    console.error("POST Error:", error);
    throw error;
  }
};

/**
 * PUT request
 * @param {string} url - Endpoint
 * @param {object|null} data - Request body (optional)
 * @param {object|null} params - Query parameters (optional)
 * @returns {Promise<object>} - API response data
 */
export const CommonPut = async (url, data = null, params = null) => {
  try {
    const response = await apiClient.put(url, data, { params });
    handleTokenExpiration(response);
    return response.data;
  } catch (error) {
    console.error("PUT Error:", error);
    throw error;
  }
};

/**
 * PATCH request
 * @param {string} url - Endpoint
 * @param {object|null} data - Request body (optional)
 * @param {object|null} params - Query parameters (optional)
 * @returns {Promise<object>} - API response data
 */
export const CommonPatch = async (url, data = null, params = null) => {
  try {
    const response = await apiClient.patch(url, data, { params });
    handleTokenExpiration(response);
    return response.data;
  } catch (error) {
    console.error("PATCH Error:", error);
    throw error;
  }
};

/**
 * DELETE request
 * @param {string} url - Endpoint
 * @param {object|null} params - Query parameters (optional)
 * @returns {Promise<object>} - API response data
 */
export const CommonDelete = async (url, params = null) => {
  try {
    const response = await apiClient.delete(url, { params });
    handleTokenExpiration(response);
    return response.data;
  } catch (error) {
    console.error("DELETE Error:", error);
    throw error;
  }
};

// Optional: Support for custom headers (e.g., file uploads)
export const CommonPostFormData = async (url, formData, params = null) => {
  try {
    const response = await apiClient.post(url, formData, {
      params,
      headers: { "Content-Type": "multipart/form-data" },
    });
    handleTokenExpiration(response);
    return response.data;
  } catch (error) {
    console.error("POST FormData Error:", error);
    throw error;
  }
};

export default {
  get: CommonGet,
  post: CommonPost,
  put: CommonPut,
  patch: CommonPatch,
  delete: CommonDelete,
  postFormData: CommonPostFormData,
};
