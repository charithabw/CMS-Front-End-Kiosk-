import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../components/DataTable";
import CategoryModal from "../components/CategoryModal";
import Pagination from "../components/Pagination";
import {
  CommonGet,
  CommonPost,
  CommonPut,
  CommonDelete,
} from "../common/httpClient";
import { checkPermissions } from "../utils/permissionUtils";
//import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const Categories = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [permission, setPermission] = useState(null);
  const [permissionLoading, setPermissionLoading] = useState(true);

  const itemsPerPage = 10;
  const screenID = 1;

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const perm = await checkPermissions(user?.roleId, screenID);
        setPermission(perm);
      } catch (error) {
        console.error("Permission check failed:", error);
        setPermission({
          canView: false,
          canAdd: false,
          canEdit: false,
          canDelete: false,
        });
      } finally {
        setPermissionLoading(false);
      }
    };

    if (user?.roleId) {
      fetchPermission();
    } else {
      setPermissionLoading(false);
    }
  }, [user?.roleId]);

  useEffect(() => {
    if (!permission?.canView) return;

    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get("category");

    if (categoryId && categories.length > 0) {
      const category = categories.find((cat) => cat.categoryID == categoryId);
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, [location.search, categories, permission]);

  useEffect(() => {
    if (permission?.canView) {
      fetchCategories();
    }
  }, [currentPage, filterValue, permission]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CommonGet("/Catogory/GetCatorgory", {
        page: currentPage,
        limit: itemsPerPage,
        search: filterValue,
      });

      let categoriesData = [];
      if (response?.data) {
        categoriesData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        categoriesData = response;
      }

      setCategories(categoriesData);
      setTotalPages(
        response?.totalPages || Math.ceil(categoriesData.length / itemsPerPage)
      );
    } catch (error) {
      console.error("Fetch categories error:", error);
      toast.error("Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProducts = (category) => {
    setSelectedCategory(category);
    navigate(`/dashboard/products?category=${category.categoryID}`);
  };

  const handleAddCategory = () => {
    if (!permission?.canAdd) {
      toast.error("You don't have permission to add categories");
      return;
    }
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    if (!permission?.canEdit) {
      toast.error("You don't have permission to edit categories");
      return;
    }
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (category) => {
    if (!permission?.canDelete) {
      toast.error("You don't have permission to delete categories");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this category and all its products?"
      )
    ) {
      try {
        // Create updated category data with isActive set to false
        const updatedCategoryData = {
          catEng: category.catEng,
          catSin: category.catSin,
          catTam: category.catTam,
          imagePath: category.imagePath,
          isActive: false,
          createdBy: category.createdBy,
          modifiedBy: user?.userId || 1,
        };

        await CommonPut(
          `/Catogory/UpdateCategory/${category.categoryID}`,
          updatedCategoryData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Category deactivated successfully");
        fetchCategories();
      } catch (error) {
        console.error("Delete category error:", error);
        toast.error("Failed to deactivate category");
      }
    }
  };

  const handleSubmitCategory = async (categoryData) => {
    try {
      if (currentCategory) {
        await CommonPut(
          `/Catogory/UpdateCategory/${currentCategory.categoryID}`,
          categoryData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Category updated successfully");
      } else {
        await CommonPost("/Catogory/SaveCategory", categoryData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Category added successfully");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Submit category error:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Operation failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const filteredCategories = categories.filter((category) => {
    if (!category) return false;
    const searchTerm = filterValue.toLowerCase();
    return (
      (category.catEng?.toLowerCase() || "").includes(searchTerm) ||
      (category.catSin?.toLowerCase() || "").includes(searchTerm) ||
      (category.catTam?.toLowerCase() || "").includes(searchTerm)
    );
  });

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: "ID", accessor: "categoryID" },
    {
      header: "Category Name",
      accessor: "combinedNames",
      cell: (_, row) => (
        <div>
          <div>
            <strong>English:</strong> {row.catEng}
          </div>
          <div>
            <strong>Sinhala:</strong> {row.catSin}
          </div>
          <div>
            <strong>Tamil:</strong> {row.catTam}
          </div>
        </div>
      ),
    },
    {
      header: "Image",
      accessor: "imagePath",
      cell: (value, row) => (
        <img
          src={value || "/default-category.png"}
          alt={row.catEng}
          className="w-10 h-10 object-cover rounded"
          onError={(e) => {
            e.target.src = "/default-category.png";
          }}
        />
      ),
    },
    {
      header: "Status",
      accessor: "isActive",
      cell: (value) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Products",
      accessor: "products",
      cell: (_, row) => (
        <button
          onClick={() => handleViewProducts(row)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          View Products
        </button>
      ),
    },
    ...(permission?.canEdit || permission?.canDelete
      ? [
          {
            header: "Actions",
            accessor: "actions",
            cell: (_, row) => (
              <div className="flex space-x-2">
                {permission?.canEdit && (
                  <button
                    onClick={() => handleEditCategory(row)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                )}
                {permission?.canDelete && (
                  <button
                    onClick={() => handleDeleteCategory(row)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  if (permissionLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!permission?.canView) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Category Management (Logged in as {user.username})
          </h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Filter categories..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            {permission?.canAdd && (
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Category
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginatedCategories}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              permission={permission}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {(permission?.canAdd || permission?.canEdit) && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          category={currentCategory}
          onSubmit={handleSubmitCategory}
          user={user}
        />
      )}
    </div>
  );
};

export default Categories;
