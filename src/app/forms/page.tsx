"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const department = ["Machining", "Assembly", "Packaging", "Shipping"] as const;
const statusValues = ["Operational", "Down", "Maintenance", "Retired"] as const;

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  location: z.string().min(1, "Location is required"),
  department: z.enum(department, { message: "Invalid department" }),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().regex(/^[a-zA-Z0-9]+$/, "Serial Number must be alphanumeric"),
  installDate: z.string().refine((val) => new Date(val) < new Date(), "Install Date must be a past date"),
  status: z.enum(statusValues, { message: "Invalid status" }),
});

type FormData = z.infer<typeof schema>;

const FormEquipment: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Banner */}
      <div>
          <h1>Welcome to our page</h1>
      </div>

        {/* Links */}
      <div className="w-full bg-blue-600 text-white py-2 text-center">
        <a href="" className="text-lg font-semibold hover:underline">
          Links
          </a>
      </div>

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
              <option key={dept} value={dept}>
                {dept}
              </option>
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
          <input type="date" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" {...register("installDate")} max={new Date().toISOString().split("T")[0]} />
          {errors.installDate && <p className="text-red-500 text-sm">{errors.installDate.message}</p>}
        </div>

        <div>
          <label className="block text-gray-600 font-medium">Status</label>
          <select className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" {...register("status")}>
            {statusValues.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormEquipment;