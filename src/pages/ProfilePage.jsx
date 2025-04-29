import React from "react";

const ProfilePage = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mx-4 my-4 md:mx-8 md:my-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture Section */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="w-full md:w-2/3">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-lg font-semibold">John Doe</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-lg font-semibold">johndoe@example.com</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <p className="mt-1 text-lg font-semibold">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                vel purus at sapien ultrices tincidunt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Edit Profile
        </button>
        <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
