import React from "react";
import { ClockIcon } from "@heroicons/react/outline";

const RecentActivitiesCard = ({ activities }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Activities
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ClockIcon className="h-12 w-12 mb-2" />
            <p>No recent activities</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="border-b border-gray-100 pb-3 last:border-0"
              >
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivitiesCard;
