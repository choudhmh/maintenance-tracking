"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { EquipmentFormData, MaintenanceFormData } from "./equipments_form/zodSchemas";

const Dashboard: React.FC = () => {
  const [equipmentData, setEquipmentData] = useState<EquipmentFormData[]>([]);
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceFormData[]>([]);
  const [isClient, setIsClient] = useState(false); // Track if we are on the client side

  useEffect(() => {
    // This ensures this runs only on the client
    setIsClient(true);

    const storedEquipment = JSON.parse(localStorage.getItem("equipmentData") || "[]");
    const storedMaintenance = JSON.parse(localStorage.getItem("maintenanceRecords") || "[]");

    setEquipmentData(storedEquipment);
    setMaintenanceData(storedMaintenance);
  }, []);

  // If not on the client yet, return null or loading state
  if (!isClient) {
    return null; // Or a loading spinner if you prefer
  }

  /** Process data for Pie Chart (Equipment Status Breakdown) **/
  const statusCounts = equipmentData.reduce((acc, eq) => {
    acc[eq.status] = (acc[eq.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const pieColors = ["#4CAF50", "#FFC107", "#2196F3", "#F44336"];

  /** Process data for Maintenance Hours by Department **/
  const departmentHours = maintenanceData.reduce((acc, record) => {
    const equipment = equipmentData.find(eq => eq.id === parseInt(record.equipmentId));
    const department = equipment ? equipment.department : "Unknown";

    acc[department] = (acc[department] || 0) + record.hoursSpent;
    return acc;
  }, {} as Record<string, number>);

  // Create bar chart data from departmentHours
  const barChartData = Object.keys(departmentHours).map(department => ({
    department,
    hours: departmentHours[department],
  }));

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Equipment Status Breakdown (Pie Chart) */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Equipment Status Breakdown</h3>
          <PieChart width={400} height={300}>
            <Pie data={pieChartData} cx={200} cy={150} outerRadius={100} fill="#8884d8" dataKey="value">
              {pieChartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Maintenance Hours by Department (Bar Chart) */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Maintenance Hours by Department</h3>
          <BarChart width={400} height={300} data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      {/* Recent Maintenance Activities */}
      <div className="mt-6 bg-white p-4 shadow-lg rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Recent Maintenance Activities</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Equipment</th> {/* Equipment Name Column */}
              <th className="p-2 border">Technician</th>
              <th className="p-2 border">Hours Spent</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
  {maintenanceData.slice(-5).reverse().map((record) => {
    // Find the equipment object based on the equipmentId
    const equipment = equipmentData.find(eq => eq.id === parseInt(record.equipmentId));

    return (
      <tr key={record.id} className="border-b border-gray-300">
      <td className="p-2 border">{record.date}</td>
      <td className="p-2 border">{equipment ? equipment.name : record.equipmentId}</td>
      <td className="p-2 border">{record.technician}</td>
      <td className="p-2 border">{record.hoursSpent}</td>
      <td className="p-2 border">{record.completionStatus}</td>
    </tr>
    
    );
  })}
  {maintenanceData.length === 0 && (
    <tr>
      <td colSpan={5} className="text-center p-4">
        No recent maintenance activities.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default Dashboard;
