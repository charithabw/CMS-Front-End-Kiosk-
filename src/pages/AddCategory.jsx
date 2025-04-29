import React from "react";
import { Form } from "react-router-dom";
import { toast } from "react-toastify";
import { CommonPost } from "../common/httpClient";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await CommonPost("Catogory/SaveCategory", data);
    toast.success("Category added successfully");
    return redirect("/categories");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const AddCategory = () => {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <Form method="post" className="space-y-4">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Add Category
        </h4>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="catEng"
              className="block text-sm font-medium text-gray-700"
            >
              Category (English)
            </label>
            <input
              type="text"
              id="catEng"
              name="catEng"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="catSin"
              className="block text-sm font-medium text-gray-700"
            >
              Category (Sinhala)
            </label>
            <input
              type="text"
              id="catSin"
              name="catSin"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="catTam"
              className="block text-sm font-medium text-gray-700"
            >
              Category (Tamil)
            </label>
            <input
              type="text"
              id="catTam"
              name="catTam"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="createdBy"
              className="block text-sm font-medium text-gray-700"
            >
              Created By (User ID)
            </label>
            <input
              type="number"
              id="createdBy"
              name="createdBy"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddCategory;
