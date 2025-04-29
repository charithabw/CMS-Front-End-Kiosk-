import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import StatCard from "../components/StatCard";
import RecentActivitiesCard from "../components/RecentActivitiesCard";
import UserActivityChart from "../components/UserActivityChart";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalScreens: 0,
    totalProducts: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    setTimeout(() => {
      setStats({
        totalUsers: 2,
        totalRoles: 3,
        totalScreens: 12,
        totalProducts: 23,
      });

      setRecentActivities([
        {
          id: 1,
          user: "user1",
          action: "Updated product details",
          timestamp: "2025-04-27 10:30:00",
        },
        {
          id: 2,
          user: "admin",
          action: "Added new user",
          timestamp: "2025-04-27 09:15:00",
        },
        {
          id: 3,
          user: "user1",
          action: "Modified permissions",
          timestamp: "2025-04-26 16:45:00",
        },
        {
          id: 4,
          user: "admin",
          action: "Added new screen",
          timestamp: "2025-04-26 14:20:00",
        },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Dashboard" />

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="users"
                color="blue"
              />
              <StatCard
                title="Total Roles"
                value={stats.totalRoles}
                icon="shield"
                color="green"
              />
              <StatCard
                title="Total Screens"
                value={stats.totalScreens}
                icon="desktop"
                color="purple"
              />
              <StatCard
                title="Total Products"
                value={stats.totalProducts}
                icon="box"
                color="orange"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <UserActivityChart />
              </div>
              <div className="bg-white rounded-lg shadow">
                <RecentActivitiesCard activities={recentActivities} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
