"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentSchema, EquipmentFormData } from "./zodSchemas";
import { Department, Status } from "./enum";

const FormEquipment: React.FC = () => {
  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
  });

  const [isMounted, setIsMounted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Ensure component is mounted before running Playwright tests
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to handle form submission
  const onSubmit: SubmitHandler<EquipmentFormData> = (data) => {
    const existingData: EquipmentFormData[] = JSON.parse(localStorage.getItem("equipmentData") || "[]");

    const newEquipment: EquipmentFormData = {
      ...data,
      id: data.id ?? Date.now(),
    };

    localStorage.setItem("equipmentData", JSON.stringify([...existingData, newEquipment]));
    console.log("Updated Equipment Data:", JSON.parse(localStorage.getItem("equipmentData") || "[]"));

    setSuccessMessage("Equipment added successfully!"); // Show success message in DOM
    reset();
  };

  if (!isMounted) return null; // Prevents hydration errors in Next.js

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      {/* Navigation Bar */}
      <div className="w-full bg-blue-600 text-white py-2 text-center">
        <a href="#" className="text-lg font-semibold hover:underline">Home</a>
      </div>

      {/* Equipment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg space-y-4 mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-700">Equipment Form</h2>

        {/* Equipment Name */}
        <div>
          <label className="block text-gray-600 font-medium">Name</label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("name")}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Equipment Location */}
        <div>
          <label className="block text-gray-600 font-medium">Location</label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("location")}
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        {/* Department Dropdown */}
        <div>
          <label className="block text-gray-600 font-medium">Department</label>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("department")}
            defaultValue=""
          >
            <option value="" disabled>Select Department</option>
            {Object.values(Department).map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
        </div>

        {/* Model */}
        <div>
          <label className="block text-gray-600 font-medium">Model</label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("model")}
          />
          {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-gray-600 font-medium">Serial Number</label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("serialNumber")}
          />
          {errors.serialNumber && <p className="text-red-500 text-sm">{errors.serialNumber.message}</p>}
        </div>

        {/* Install Date */}
        <div>
          <label className="block text-gray-600 font-medium">Install Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("installDate")}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.installDate && <p className="text-red-500 text-sm">{errors.installDate.message}</p>}
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="block text-gray-600 font-medium">Status</label>
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("status")}
            defaultValue=""
          >
            <option value="" disabled>Select Status</option>
            {Object.values(Status).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Equipment
        </button>
      </form>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500 text-white p-2 rounded-md mt-4 text-center">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default FormEquipment;
