"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { maintenanceSchema } from "../zodSchemas";
import { MaintenanceType, PriorityLevel, CompletionStatus } from "../enum";
import { Equipment } from "../interfaces";

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

const FormMaintenance: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  useEffect(() => {
    try {
      const storedEquipment = JSON.parse(localStorage.getItem("equipmentData") || "[]");
      setEquipmentList(storedEquipment);
    } catch (error) {
      console.error("Error reading from localStorage", error);
      setEquipmentList([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    trigger,
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      partsReplaced: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "partsReplaced",
  });

  const onSubmit: SubmitHandler<MaintenanceFormData> = async (data) => {
    const isValid = await trigger("hoursSpent");
    if (!isValid) {
      console.log("Validation failed for hoursSpent");
      return;
    }

    console.log("Form Data Submitted:", data);

    const existingData = JSON.parse(localStorage.getItem("maintenanceRecords") || "[]");

    const newRecord = {
      ...data,
      equipmentId: parseInt(data.equipmentId),
      id: Date.now(),
    };

    localStorage.setItem("maintenanceRecords", JSON.stringify([...existingData, newRecord]));

    setIsSuccess(true);
    reset();

    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-blue-600 text-white py-4 text-center font-bold text-xl">
        Maintenance Record Form
      </div>

      {/* Success Message */}
      {isSuccess && (
        <div
          className="bg-green-500 text-white py-2 px-4 rounded mt-4 text-center"
          aria-live="assertive"
        >
          ✅ Maintenance record added successfully!
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg space-y-4 mt-8"
      >
        {/* Equipment Selection */}
        <div>
          <label className="font-bold">Equipment</label>
          <select
            className="w-full p-2 border rounded-md"
            {...register("equipmentId", { required: "Equipment selection is required" })}
            disabled={isLoading || equipmentList.length === 0}
          >
            <option value="">Select Equipment</option>
            {equipmentList.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.name}
              </option>
            ))}
          </select>
          {errors.equipmentId && <p className="text-red-500 text-sm">{errors.equipmentId.message}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="font-bold">Date</label>
          <input
            type="date"
            className="w-full p-2 border rounded-md"
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        {/* Maintenance Type */}
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

        {/* Technician */}
        <div>
          <label className="font-bold">Technician</label>
          <input
            className="w-full p-2 border rounded-md"
            {...register("technician", { required: "Technician name is required" })}
          />
        </div>

        {/* Hours Spent */}
        <div>
          <label className="font-bold">Hours Spent</label>
          <input type="number" className="w-full p-2 border rounded-md" {...register("hoursSpent")} />
        </div>

        {/* Description */}
        <div>
          <label className="font-bold">Description</label>
          <textarea className="w-full p-2 border rounded-md" {...register("description")}></textarea>
        </div>

        {/* Parts Replaced */}
        <div>
          <label className="font-bold">Parts Replaced</label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex space-x-2 mb-2">
              <input className="w-full p-2 border rounded-md" {...register(`partsReplaced.${index}` as const)} />
              <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-2 py-1 rounded">
                X
              </button>
            </div>
          ))}
          <button type="button" onClick={() => append("")} className="bg-green-500 text-white px-4 py-2 rounded-md">
            + Add Part
          </button>
        </div>

        {/* Priority */}
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

        {/* Completion Status */}
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

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormMaintenance;