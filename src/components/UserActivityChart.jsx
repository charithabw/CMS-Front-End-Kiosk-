import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserActivityChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch chart data
    setTimeout(() => {
      const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

      setChartData({
        labels,
        datasets: [
          {
            label: "User Logins",
            data: [65, 59, 80, 81, 56, 55, 72],
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "Content Edits",
            data: [28, 48, 40, 19, 86, 27, 90],
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Screen Views",
            data: [33, 25, 35, 51, 54, 76, 80],
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
        ],
      });

      setIsLoading(false);
    }, 1000);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "User Activity Over Time",
      },
    },
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">User Activity</h3>
      </div>

      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="h-64">
            <Line options={options} data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityChart;
