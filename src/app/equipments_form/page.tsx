"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentSchema, EquipmentFormData, department, statusValues } from "./zodSchemas";



type FormData = EquipmentFormData;

const FormEquipment: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(equipmentSchema),
  });

  // const [data, setData] = useState<EquipmentFormData[]>([]);
  // const [search, setSearch] = useState(""); // For filtering by name
  // const [statusFilter, setStatusFilter] = useState(""); // For filtering by status
  // const [sortColumn, setSortColumn] = useState<keyof EquipmentFormData | null>(null);
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const existingData = JSON.parse(localStorage.getItem("equipmentData") || "[]");

    const updatedData = [...existingData, { id: Date.now(), ...data }];
    localStorage.setItem("equipmentData", JSON.stringify(updatedData));
    alert("Equipment added successfully!");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
    
      <div>
        <h1>Welcome to our page</h1>
      </div>

     
      <div className="w-full bg-blue-600 text-white py-2 text-center">
        <a href="" className="text-lg font-semibold hover:underline">Links</a>
      </div>

      {/* Equipment Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg space-y-4 mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-700">Equipment Form</h2>

        <div>
          <label className="block text-gray-600 font-medium">Name</label>
          <input className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" {...register("name")} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-gray-600 font-medium">Location</label>
          <input className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" {...register("location")} />
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block text-gray-600 font-medium">Department</label>
          <select className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" {...register("department")}>
            {department.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
        </div>

        <div>
          <label className="block text-gray-600 font-medium">Model</label>
          <input className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" {...register("model")} />
          {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
        </div>

        <div>
          <label className="block text-gray-600 font-medium">Serial Number</label>
          <input className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" {...register("serialNumber")} />
          {errors.serialNumber && <p className="text-red-500 text-sm">{errors.serialNumber.message}</p>}
        </div>

        <div>
          <label className="block text-gray-600 font-medium">Install Date</label>
          <input type="date" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("installDate")}
            max={new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0]}
          />
          {errors.installDate && <p className="text-red-500 text-sm">{errors.installDate.message}</p>}
        </div>

        <div>
          <label className="block text-gray-600 font-medium">Status</label>
          <select className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" {...register("status")}>
            {statusValues.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>
        
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">Submit</button>
      

      </form>

    
    </div>
  );
};

export default FormEquipment;
