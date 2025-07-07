import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import DataTable from "../components/DataTable";
import PromotionalModal from "../components/PromotionalModal";
import Pagination from "../components/Pagination";
import {
  CommonGet,
  CommonPost,
  CommonPut,
  CommonDelete,
} from "../common/httpClient";
import { checkPermissions } from "../utils/permissionUtils";
//import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const Promotionals = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [promotionals, setPromotionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPromotional, setCurrentPromotional] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [permission, setPermission] = useState(null);
  const [permissionLoading, setPermissionLoading] = useState(true);

  const itemsPerPage = 10;
  const screenID = 2; // Change as needed for your permission system

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
    if (permission?.canView) {
      fetchPromotionals();
    }
  }, [currentPage, filterValue, permission]);

  const fetchPromotionals = async () => {
    try {
      setLoading(true);
      const response = await CommonGet("/Promotional/GetPromotional", {
        page: currentPage,
        limit: itemsPerPage,
        search: filterValue,
      });
      let promoData = [];
      if (response?.data) {
        promoData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        promoData = response;
      }
      setPromotionals(promoData);
      setTotalPages(
        response?.totalPages || Math.ceil(promoData.length / itemsPerPage)
      );
    } catch (error) {
      toast.error("Failed to fetch promotionals");
      setPromotionals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromotional = () => {
    if (!permission?.canAdd) {
      toast.error("You don't have permission to add promotionals");
      return;
    }
    setCurrentPromotional(null);
    setIsModalOpen(true);
  };

  const handleEditPromotional = (promotional) => {
    if (!permission?.canEdit) {
      toast.error("You don't have permission to edit promotionals");
      return;
    }
    setCurrentPromotional(promotional);
    setIsModalOpen(true);
  };

  const handleDeletePromotional = async (promotional) => {
    if (!permission?.canDelete) {
      toast.error("You don't have permission to delete promotionals");
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to deactivate this promotional?"
      )
    ) {
      try {
        const updatedData = {
          promotionalName: promotional.promotionalName,
          promotionalDesc: promotional.promotionalDesc,
          imagePath: promotional.imagePath,
          isActive: false,
          status: promotional.status,
          modifiedBy: user?.userId || 1,
        };
        await CommonPut(
          `/Promotional/updatePromotional/${promotional.promotionalID}`,
          updatedData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Promotional deactivated successfully");
        fetchPromotionals();
      } catch (error) {
        toast.error("Failed to deactivate promotional");
      }
    }
  };

  const handleSubmitPromotional = async (promoData) => {
    try {
      if (currentPromotional) {
        await CommonPut(
          `/Promotional/updatePromotional/${currentPromotional.promotionalID}`,
          {
            ...promoData,
            modifiedBy: user?.userId || 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Promotional updated successfully");
      } else {
        await CommonPost(
          "/Promotional/SavePromotional",
          {
            ...promoData,
            createdBy: user?.userId || 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Promotional added successfully");
      }
      setIsModalOpen(false);
      fetchPromotionals();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Operation failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const filteredPromotionals = promotionals.filter((promo) => {
    if (!promo) return false;
    const searchTerm = filterValue.toLowerCase();
    return (
      (promo.promotionalName?.toLowerCase() || "").includes(searchTerm) ||
      (promo.promotionalDesc?.toLowerCase() || "").includes(searchTerm) ||
      (promo.status?.toLowerCase() || "").includes(searchTerm)
    );
  });

  const paginatedPromotionals = filteredPromotionals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { header: "ID", accessor: "promotionalID" },
    {
      header: "Name",
      accessor: "promotionalName",
    },
    {
      header: "Description",
      accessor: "promotionalDesc",
    },
    {
      header: "Image",
      accessor: "imagePath",
      cell: (value, row) => (
        <img
          src={value || "/default-category.png"}
          alt={row.promotionalName}
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
      header: "Custom Status",
      accessor: "status",
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
                    onClick={() => handleEditPromotional(row)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                )}
                {permission?.canDelete && (
                  <button
                    onClick={() => handleDeletePromotional(row)}
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Promotional Management (Logged in as {user.username})
          </h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Filter promotionals..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            {permission?.canAdd && (
              <button
                onClick={handleAddPromotional}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Promotional
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
              data={paginatedPromotionals}
              onEdit={handleEditPromotional}
              onDelete={handleDeletePromotional}
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
        <PromotionalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          promotional={currentPromotional}
          onSubmit={handleSubmitPromotional}
          user={user}
        />
      )}
    </div>
  );
};

export default Promotionals;
