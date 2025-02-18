"use client";

import React, { useEffect, useState } from "react";
import { MaintenanceFormData } from "../../zodSchemas"; // Ensure this path is correct
import { Equipment } from "../../interfaces"; // Ensure this path is correct

const MaintenanceTable: React.FC = () => {
  // State to store maintenance records and equipment data
  const [records, setRecords] = useState<MaintenanceFormData[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  // Search and filtering state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Date range filtering state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Grouping and sorting state
  const [groupByEquipment, setGroupByEquipment] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof MaintenanceFormData | "equipmentName" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch data from localStorage when the component mounts
  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("maintenanceRecords") || "[]") as MaintenanceFormData[];
    const storedEquipment = JSON.parse(localStorage.getItem("equipmentData") || "[]") as Equipment[];
    setRecords(storedRecords);
    setEquipment(storedEquipment);
  }, []);

  // Function to get equipment name from ID
  const getEquipmentName = (id: string | number) => {
    return equipment.find((eq) => String(eq.id) === String(id))?.name || "Unknown";
  };

  // Handle sorting logic
  const handleSort = (column: keyof MaintenanceFormData | "equipmentName") => {
    const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  };

  let processedData = records.map((record, index) => ({
    id: index.toString(), // Generate ID if missing
    ...record,
    equipmentName: getEquipmentName(record.equipmentId),
  }));

  // Apply sorting
  if (sortColumn) {
    processedData = [...processedData].sort((a, b) => {
      const valueA = sortColumn === "equipmentName" ? a.equipmentName.toLowerCase() : a[sortColumn];
      const valueB = sortColumn === "equipmentName" ? b.equipmentName.toLowerCase() : b[sortColumn];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
      return 0;
    });
  }

  // Apply filtering
  const filteredData = processedData.filter((record) => {
    // Check if the equipment name matches search
    const matchesSearch = record.equipmentName.toLowerCase().includes(search.toLowerCase());

    // Check if status matches filter
    const matchesStatus = statusFilter ? record.completionStatus === statusFilter : true;

    // Check if record date is within the selected date range
    const recordDate = new Date(record.date);
    const matchesDateRange =
      (!startDate || recordDate >= new Date(startDate)) && (!endDate || recordDate <= new Date(endDate));

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Maintenance Records</h2>

      {/* Filters & Controls */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-md w-1/3"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Filter by Status</option>
          <option value="Complete">Complete</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Date range filters */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded-md"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded-md"
        />

        <button
          onClick={() => setGroupByEquipment((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {groupByEquipment ? "Ungroup" : "Group by Equipment"}
        </button>
      </div>

      {/* Display Table */}
      {!groupByEquipment ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("equipmentName")}>
                Equipment {sortColumn === "equipmentName" ? (sortDirection === "asc" ? "⬆" : "⬇") : ""}
              </th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("date")}>
                Date {sortColumn === "date" ? (sortDirection === "asc" ? "⬆" : "⬇") : ""}
              </th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Technician</th>
              <th className="p-2 border">Hours Spent</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Parts Replaced</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border cursor-pointer" onClick={() => handleSort("completionStatus")}>
                Status {sortColumn === "completionStatus" ? (sortDirection === "asc" ? "⬆" : "⬇") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  No maintenance records available
                </td>
              </tr>
            ) : (
              filteredData.map((record) => (
                <tr key={record.id} className="border-b border-gray-300">
                  <td className="p-2 border">{record.equipmentName}</td>
                  <td className="p-2 border">{record.date}</td>
                  <td className="p-2 border">{record.type}</td>
                  <td className="p-2 border">{record.technician}</td>
                  <td className="p-2 border">{record.hoursSpent} hrs</td>
                  <td className="p-2 border">{record.description}</td>
                  <td className="p-2 border">{record.partsReplaced?.join(", ") || "N/A"}</td>
                  <td className="p-2 border">{record.priority}</td>
                  <td className="p-2 border">{record.completionStatus}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-center p-4">Grouped view enabled</p>
      )}
    </div>
  );
};

export default MaintenanceTable;
