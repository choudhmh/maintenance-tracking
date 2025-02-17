"use client"; // Enables React's client-side rendering

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { maintenanceSchema } from "../zodSchemas"; // Import schema for form validation
import { MaintenanceType, PriorityLevel, CompletionStatus } from "../enum"; // Import enums
import { Equipment, MaintenanceRecord } from "../interfaces";


type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

const FormMaintenance: React.FC = () => {
  // State to store equipment list
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);

  // Fetch equipment data from local storage on component mount
  useEffect(() => {
    const storedEquipment = JSON.parse(localStorage.getItem("equipmentData") || "[]");
    setEquipmentList(storedEquipment);
  }, []);

  // Initialize react-hook-form with validation resolver
  const {
    register, 
    handleSubmit, 
    control, // Controls dynamic form fields
    reset, // Reset form after submission
    formState: { errors }, // Manage form errors
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema), // Validate with Zod schema
    defaultValues: {
      partsReplaced: [], // Default empty array for parts replaced
    },
  });

  // Manage dynamic fields for parts replaced
  const { fields, append, remove } = useFieldArray({
    control,
    name: "partsReplaced",
  });

  // Function to handle form submission
  const onSubmit: SubmitHandler<MaintenanceFormData> = (data) => {
    // Retrieve existing maintenance records from local storage
    const existingData = JSON.parse(localStorage.getItem("maintenanceRecords") || "[]");

    // Create new maintenance record with unique ID
    const newRecord = {
      ...data,
      equipmentId: parseInt(data.equipmentId), // Ensure equipmentId is stored as number
      id: Date.now(), // Unique identifier
    };

    // Save updated maintenance records to local storage
    localStorage.setItem("maintenanceRecords", JSON.stringify([...existingData, newRecord]));

    alert("Maintenance record added successfully!"); // Notify user
    reset(); 
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      {/* Form header */}
      <div className="w-full bg-blue-600 text-white py-4 text-center font-bold text-xl">
        Maintenance Record Form
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg space-y-4 mt-8"
      >
        {/* Equipment selection dropdown */}
        <div>
          <label className="font-bold">Equipment</label>
          <select className="w-full p-2 border rounded-md" {...register("equipmentId")}>
            <option value="">Select Equipment</option>
            {equipmentList.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name}
              </option>
            ))}
          </select>
          {errors.equipmentId && <p className="text-red-500 text-sm">{errors.equipmentId.message}</p>}
        </div>

        {/* Maintenance date input */}
        <div>
          <label className="font-bold">Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            {...register("date")}
            max={new Date().toISOString().split("T")[0]} // Restrict future dates
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        {/* Maintenance type selection */}
        <div>
          <label className="font-bold">Type</label>
          <select className="w-full p-2 border rounded-md" {...register("type")}>
            {Object.values(MaintenanceType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Technician input */}
        <div>
          <label className="font-bold">Technician</label>
          <input className="w-full p-2 border rounded-md" {...register("technician")} />
          {errors.technician && <p className="text-red-500 text-sm">{errors.technician.message}</p>}
        </div>

        {/* Hours spent input */}
        <div>
          <label className="font-bold">Hours Spent</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md"
            {...register("hoursSpent", { valueAsNumber: true })}
          />
          {errors.hoursSpent && <p className="text-red-500 text-sm">{errors.hoursSpent.message}</p>}
        </div>

        {/* Maintenance description */}
        <div>
          <label className="font-bold">Description</label>
          <textarea className="w-full p-2 border rounded-md" {...register("description")}></textarea>
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Parts replaced section */}
        <div>
          <label className="font-bold">Parts Replaced</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-2 mb-2">
              <input
                className="w-full p-2 border rounded-md"
                {...register(`partsReplaced.${index}` as const)}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append("")}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            + Add Part
          </button>
        </div>

        {/* Priority selection */}
        <div>
          <label className="font-bold">Priority</label>
          <select className="w-full p-2 border rounded-md" {...register("priority")}>
            {Object.values(PriorityLevel).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Completion status selection */}
        <div>
          <label className="font-bold">Completion Status</label>
          <select className="w-full p-2 border rounded-md" {...register("completionStatus")}>
            {Object.values(CompletionStatus).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormMaintenance;
