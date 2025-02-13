"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { equipmentSchema, statusValues } from "../zodSchemas";

type EquipmentFormData = z.infer<typeof equipmentSchema>;

const EquipmentTable: React.FC = () => {

  //state managments
  const [data, setData] = useState<EquipmentFormData[]>([]);
  const [search, setSearch] = useState(""); // Search filter state
  const [statusFilter, setStatusFilter] = useState(""); // Status filter state
  const [sortColumn, setSortColumn] = useState<keyof EquipmentFormData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // direction state
  

  // Fetch the data from localStorage when the component mounts
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("equipmentData") || "[]");
    setData(storedData);
  }, []);

// Function to handle sorting when a column header is clicked
  const handleSort = (column: keyof EquipmentFormData) => {
    // Toggle sorting direction when the column is clicked
    const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  };

// Sort the data based on the selected column and direction
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0; // If no column selected, return unsorted data
    const valueA = a[sortColumn] as string;
    const valueB = b[sortColumn] as string;
    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  // Filter the sorted data based on the search query filter
  const filteredData = sortedData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter ? item.status === statusFilter : true)
  );

  //Rendering the Table
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Equipment Table</h2>

      {/* 🔍 Search & Filter Controls */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select
          className="border p-2 rounded w-1/3"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statusValues.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* 📊 Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
      
          <tr>
            {["name", "location", "department", "model", "serialNumber", "installDate", "status"].map((column) => (
              <th
                key={column}
                className="p-2 border cursor-pointer hover:bg-gray-300"
                onClick={() => handleSort(column as keyof EquipmentFormData)}
              >
                
                {column.charAt(0).toUpperCase() + column.slice(1)}
                {sortColumn === column && (sortDirection === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4">No matching equipment</td>
            </tr>
          ) : (
            filteredData.map((item, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.location}</td>
                <td className="p-2 border">{item.department}</td>
                <td className="p-2 border">{item.model}</td>
                <td className="p-2 border">{item.serialNumber}</td>
                <td className="p-2 border">{item.installDate}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded ${
                      item.status === "Operational"
                        ? "bg-green-200"
                        : item.status === "Down"
                        ? "bg-yellow-200"
                        : item.status === "Maintenance"
                        ? "bg-blue-200"
                        : item.status === "Retired"
                        ? "bg-red-200"
                        : "bg-gray-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
