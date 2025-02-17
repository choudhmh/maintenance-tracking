"use client"; // Enables React's client-side rendering for Next.js

import React, { useEffect, useState } from "react";
import { z } from "zod";
import { equipmentSchema } from "../zodSchemas";
import { Status } from "../enum"; // Import Status enum for status filtering & display

// Define TypeScript type for equipment data based on Zod schema
type EquipmentFormData = z.infer<typeof equipmentSchema>;

const EquipmentTable: React.FC = () => {
  // State to store equipment data
  const [data, setData] = useState<EquipmentFormData[]>([]);
  
  // State for search and filtering
  const [search, setSearch] = useState(""); 
  const [statusFilter, setStatusFilter] = useState<"" | EquipmentFormData["status"]>("");

  // State for sorting
  const [sortColumn, setSortColumn] = useState<keyof EquipmentFormData | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // State for tracking selected rows
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Load equipment data from localStorage on component mount
  useEffect(() => {
    const storedData: unknown = JSON.parse(localStorage.getItem("equipmentData") || "[]");

    if (Array.isArray(storedData)) {
      const validatedData = storedData.filter(
        (item): item is EquipmentFormData =>
          typeof item === "object" &&
          item !== null &&
          "status" in item &&
          Object.values(Status).includes(item.status as EquipmentFormData["status"])
      );
      setData(validatedData);
    }
  }, []);

  // Function to handle sorting
  const handleSort = (column: keyof EquipmentFormData) => {
    const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Apply sorting to the data
  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    return 0;
  });

  // Apply search and status filter
  const filteredData = sortedData.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter ? item.status === statusFilter : true)
  );

  // Function to toggle row selection for bulk actions
  const toggleRowSelection = (id: number | undefined) => {
    if (id === undefined) return; // Prevent errors if id is missing
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Function to update status for selected rows
  const updateSelectedStatus = (newStatus: EquipmentFormData["status"]) => {
    if (!newStatus || selectedRows.length === 0) return;

    const updatedData = data.map((item) =>
      item.id !== undefined && selectedRows.includes(item.id) ? { ...item, status: newStatus } : item
    );

    setData(updatedData);
    localStorage.setItem("equipmentData", JSON.stringify(updatedData));
    setSelectedRows([]); // Clear selection after update
  };

  // Function to delete all equipment data
  const clearAllData = () => {
    setData([]);
    localStorage.removeItem("equipmentData");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Equipment Table</h2>

      {/* Filters and bulk update controls */}
      <div className="flex space-x-4 mb-4">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-md w-1/3"
        />

        {/* Status filter dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as EquipmentFormData["status"])}
          className="p-2 border rounded-md"
        >
          <option value="">Filter by Status</option>
          {Object.values(Status).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Bulk update status dropdown */}
        <select
          onChange={(e) => updateSelectedStatus(e.target.value as EquipmentFormData["status"])}
          className="p-2 border rounded-md"
        >
          <option value="">Bulk Update Status</option>
          {Object.values(Status).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Button to delete all records */}
      <button
        onClick={() => {
          const confirmDelete = window.confirm("Warning: This will permanently delete all equipment data. Are you sure?");
          if (confirmDelete) {
            clearAllData();
          }
        }}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Delete All Records
      </button>

      {/* Equipment Table */}
      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Select</th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort("name")}>
              Name {sortColumn === "name" ? (sortDirection === "asc" ? "⬆" : "⬇") : ""}
            </th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Model</th>
            <th className="p-2 border">Serial Number</th>
            <th className="p-2 border">Install Date</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center p-4">
                No equipment added yet
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id} className="border-b border-gray-300">
                {/* Row selection checkbox */}
                <td className="p-2 border">
                  <input
                    type="checkbox"
                    checked={item.id !== undefined && selectedRows.includes(item.id)}
                    onChange={() => toggleRowSelection(item.id)}
                  />
                </td>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.location}</td>
                <td className="p-2 border">{item.department}</td>
                <td className="p-2 border">{item.model}</td>
                <td className="p-2 border">{item.serialNumber}</td>
                <td className="p-2 border">{item.installDate}</td>
                {/* Status badge with color coding */}
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded ${
                      item.status === Status.Operational
                        ? "bg-green-200"
                        : item.status === Status.Down
                        ? "bg-yellow-200"
                        : item.status === Status.Maintenance
                        ? "bg-blue-200"
                        : "bg-red-200"
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
