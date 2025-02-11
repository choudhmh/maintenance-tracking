"use client";
import React from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { schema, equipmentList, maintenanceTypes, priorities, completionStatuses  } from "../zodSchemas";

type FormData = z.infer<typeof schema>;

const FormMaintenance: React.FC = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { partsReplaced: [] },
  });
  
  const { fields, append, remove } = useFieldArray({ control, name: "partsReplaced" });
  
  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-blue-600 text-white py-4 text-center font-bold text-xl">
        Maintenance Record Form
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg space-y-4 mt-8">
       <div>
        <label>Equipment</label>
        <select className="w-full p-2 border rounded-md" {...register("equipment")}> 
          {equipmentList.map((eq) => (
            <option key={eq} value={eq}>{eq}</option>
          ))}
        </select>
        {errors.equipment && <p className="text-red-500 text-sm">{errors.equipment.message}</p>}
</div>
<div>
        <label>Date</label>
        <input type="date" className="w-full p-2 border rounded-md" {...register("date")} max={new Date().toISOString().split("T")[0]} />
   </div> 
        <div>
        <label>Type</label>
        <select className="w-full p-2 border rounded-md" {...register("type")}>
          {maintenanceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
</div>
<div>
        <label>Technician</label>
        <input className="w-full p-2 border rounded-md" {...register("technician")} />
        {errors.technician && <p className="text-red-500 text-sm">{errors.technician.message}</p>}
</div>
<div>
        <label>Hours Spent</label>
        <input type="number" className="w-full p-2 border rounded-md" {...register("hoursSpent", { valueAsNumber: true })} />
        {errors.hoursSpent && <p className="text-red-500 text-sm">{errors.hoursSpent.message}</p>}
</div>
<div>
        <label>Description</label>
        <textarea className="w-full p-2 border rounded-md" {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
</div>
<div>
        <label>Parts Replaced</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex space-x-2">
            <input className="w-full p-2 border rounded-md" {...register(`partsReplaced.${index}`)} />
            <button type="button" onClick={() => remove(index)} className="bg-red-500 text-white px-2 py-1 rounded-md">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => append("")} className="bg-green-500 text-white px-2 py-1 rounded-md">Add Part</button>
</div>
<div>
        <label>Priority</label>
        <select className="w-full p-2 border rounded-md" {...register("priority")}>
          {priorities.map((priority) => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
        {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
</div>
<div>
        <label>Completion Status</label>
        <select className="w-full p-2 border rounded-md" {...register("completionStatus")}>
          {completionStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        {errors.completionStatus && <p className="text-red-500 text-sm">{errors.completionStatus.message}</p>}
</div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormMaintenance;
