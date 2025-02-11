"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { equipmentSchema } from "../zodSchemas"; // Import the same schema used in FormEquipment
import Link from "next/link";

type EquipmentFormData = z.infer<typeof equipmentSchema>; // Get the inferred type

const EquipmentTable: React.FC = () => {
    const [data, setData] = useState<EquipmentFormData[]>([]); // Explicitly type as an array of FormData

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("equipmentData") || "[]");
    setData(storedData);
  }, []);

  const clearTable = () =>{
    localStorage.removeItem("equipmentData");
    setData([]);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Equipment Table</h2>
      
      <Link href="/equipments_form">
        <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Back to Form</button>
      </Link>

      <button onClick={clearTable} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Clear All
        </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Model</th>
            <th className="p-2 border">Serial Number</th>
            <th className="p-2 border">Install Date</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center p-4">No equipment added yet</td>
            </tr>
          ) : (
            data.map((item, index) => (
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
