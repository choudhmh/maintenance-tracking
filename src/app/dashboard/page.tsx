"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { EquipmentFormData, MaintenanceFormData } from "./equipments_form/zodSchemas";

const Dashboard: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  // Lazy initialization for localStorage data
  const [equipmentData, setEquipmentData] = useState<EquipmentFormData[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("equipmentData") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  const [maintenanceData, setMaintenanceData] = useState<MaintenanceFormData[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("maintenanceRecords") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
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
    const equipment = equipmentData.find(eq => eq.id === Number(record.equipmentId));
    const department = equipment ? equipment.department : "Unknown";

    acc[department] = (acc[department] || 0) + record.hoursSpent;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.keys(departmentHours).map(department => ({
    department,
    hours: departmentHours[department],
  }));

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="mt-6 bg-white p-4 shadow-lg rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Recent Maintenance Activities</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th scope="col" className="p-2 border">Date</th>
              <th scope="col" className="p-2 border">Equipment</th>
              <th scope="col" className="p-2 border">Technician</th>
              <th scope="col" className="p-2 border">Hours Spent</th>
              <th scope="col" className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceData.slice(-5).reverse().map((record, index) => {
              const equipment = equipmentData.find(eq => eq.id === Number(record.equipmentId));
              return (
                <tr key={index} className="border-b border-gray-300">
                  <td className="p-2 border">{record.date}</td>
                  <td className="p-2 border">{equipment ? equipment.name : record.equipmentId}</td>
                  <td className="p-2 border">{record.technician}</td>
                  <td className="p-2 border">{record.hoursSpent}</td>
                  <td className="p-2 border">{record.completionStatus}</td>
                </tr>
              );
            })}
          </tbody>
          {maintenanceData.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={5} className="text-center p-4">No recent maintenance activities.</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
