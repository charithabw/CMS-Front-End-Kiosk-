import React, { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../components/DataTable";
import ProductModal from "../components/ProductModal";
import Pagination from "../components/Pagination";
import {
  CommonGet,
  CommonPost,
  CommonPut,
  CommonDelete,
} from "../common/httpClient";
import { checkPermissions } from "../utils/permissionUtils";
//import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const Products = () => {
  const { user } = useOutletContext();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [permission, setPermission] = useState(null);
  const [permissionLoading, setPermissionLoading] = useState(true);

  const itemsPerPage = 10;
  const screenID = 2; // Adjust as needed

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const perm = await checkPermissions(user?.roleId, screenID);
        setPermission(perm);
      } catch (error) {
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
    const id = searchParams.get("category");
    if (id) {
      setCategoryId(id);
      fetchProducts(id);
    } else {
      toast.error("No category selected");
      setLoading(false);
    }
  }, [location.search, currentPage, permission]);

  const fetchProducts = async (categoryId) => {
    try {
      setLoading(true);
      // Fetch product names for this category
      const namesResponse = await CommonGet(
        `/ProductName/GetProductName?CategoryID=${categoryId}`
      );
      const productNames = namesResponse.data || namesResponse;
      if (!productNames || productNames.length === 0) {
        setProducts([]);
        setTotalPages(1);
        return;
      }
      // Fetch images and details for each product
      const productsWithDetails = await Promise.all(
        productNames.map(async (product) => {
          try {
            const [imageResponse, detailResponse] = await Promise.all([
              CommonGet(
                `/ProductImage/GetProductImageByProductNameID?productNameID=${product.productNameID}`
              ),
              CommonGet(
                `/ProductDetail/GetProductDetailByProductNameID?productNameID=${product.productNameID}`
              ),
            ]);
            // Extract image path from API (array in data)
            const imageDataArr = imageResponse.data || imageResponse;
            const imageData = Array.isArray(imageDataArr) ? imageDataArr[0] : imageDataArr;
            // Extract details
            const detailDataArr = detailResponse.data || detailResponse;
            const detailData = Array.isArray(detailDataArr) ? detailDataArr[0] : detailDataArr;
            return {
              ...product,
              logo: imageData?.logo || "",
              backgroundImage: imageData?.backgroundImage || "",
              ...detailData,
            };
          } catch (error) {
            return {
              ...product,
              logo: "",
              backgroundImage: "",
            };
          }
        })
      );
      setProducts(productsWithDetails);
      setTotalPages(Math.ceil(productsWithDetails.length / itemsPerPage));
    } catch (error) {
      toast.error("Failed to load products");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    if (!permission?.canAdd) {
      toast.error("You don't have permission to add products");
      return;
    }
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    if (!permission?.canEdit) {
      toast.error("You don't have permission to edit products");
      return;
    }
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    if (!permission?.canDelete) {
      toast.error("You don't have permission to delete products");
      return;
    }
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await CommonDelete(`/Product/DeleteProduct/${product.productNameID}`);
        toast.success("Product deleted successfully");
        fetchProducts(categoryId);
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleSubmitProduct = async (formData) => {
    try {
      if (currentProduct?.productNameID) {
        await CommonPut(
          `/Product/UpdateProduct/${currentProduct.productNameID}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Product updated successfully");
      } else {
        await CommonPost("/Product/SaveProduct", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Product added successfully");
      }
      setIsModalOpen(false);
      fetchProducts(categoryId);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Operation failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    const searchTerm = filterValue.toLowerCase();
    return (
      (product.prodEng?.toLowerCase() || "").includes(searchTerm) ||
      (product.prodSin?.toLowerCase() || "").includes(searchTerm) ||
      (product.prodTam?.toLowerCase() || "").includes(searchTerm)
    );
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: "ID", accessor: "productNameID" },
    { header: "English Name", accessor: "prodEng" },
    { header: "Sinhala Name", accessor: "prodSin" },
    { header: "Tamil Name", accessor: "prodTam" },
    {
      header: "Logo",
      accessor: "logo",
      cell: (value) => (
        <img
          src={value || "/default-product.png"}
          alt="Product Logo"
          className="w-10 h-10 object-contain rounded bg-gray-100"
          onError={(e) => {
            e.target.src = "/default-product.png";
          }}
        />
      ),
    },
    {
      header: "Background",
      accessor: "backgroundImage",
      cell: (value) => (
        <img
          src={value || "/default-bg.jpg"}
          alt="Product Background"
          className="w-10 h-10 object-cover rounded"
          onError={(e) => {
            e.target.src = "/default-bg.jpg";
          }}
        />
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
                    onClick={() => handleEditProduct(row)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                )}
                {permission?.canDelete && (
                  <button
                    onClick={() => handleDeleteProduct(row)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
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

  if (!categoryId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold mb-4">No Category Selected</h2>
          <p>Please select a category to view its products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Product Management (Category ID: {categoryId})
          </h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Filter products..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            {permission?.canAdd && (
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Product
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
            {filteredProducts.length > 0 ? (
              <>
                <DataTable
                  columns={columns}
                  data={paginatedProducts}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  permission={permission}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No products found for this category
                </p>
                {permission?.canAdd && (
                  <button
                    onClick={handleAddProduct}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add First Product
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {(permission?.canAdd || permission?.canEdit) && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={currentProduct}
          onSubmit={handleSubmitProduct}
          user={user}
        />
      )}
    </div>
  );
};

export default Products;
