import { z } from "zod";
import { MaintenanceType, PriorityLevel, CompletionStatus, Status, Department } from "./enum";


// Equipment Schema for validations
export const equipmentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, { message: "Name is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  department: z.nativeEnum(Department, {
    errorMap: () => ({ message: "Invalid department" }),
  }),
  model: z.string().min(1, { message: "Model is required" }),
  serialNumber: z.string().min(1, { message: "Serial number is required" }),
  installDate: z.string().refine((val) => {
    const selectedDate = new Date(val);
    return selectedDate <= new Date();
  }, { message: "Install date cannot be in the future" }),
  status: z.nativeEnum(Status, {
    errorMap: () => ({ message: "Invalid status" }),
  }),
});

// export TypeScript type for equipment form
export type EquipmentFormData = z.infer<typeof equipmentSchema>;

// Maintenance Schema for validations
export const maintenanceSchema = z.object({
  equipmentId: z.string().min(1, { message: "Equipment is required" }), // Store as string, convert later
  date: z.string().refine((val) => {
    const selectedDate = new Date(val);
    return selectedDate <= new Date();
  }, { message: "Date cannot be in the future" }),
  type: z.nativeEnum(MaintenanceType, {
    errorMap: () => ({ message: "Invalid maintenance type" }),
  }),
  technician: z.string().min(2, { message: "Technician must be at least 2 characters" }),
  hoursSpent: z.number().min(0, { message: "Hours must be positive" }).max(24, { message: "Cannot exceed 24 hours" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  partsReplaced: z.array(z.string()).optional(),
  priority: z.nativeEnum(PriorityLevel, {
    errorMap: () => ({ message: "Invalid priority level" }),
  }),
  completionStatus: z.nativeEnum(CompletionStatus, {
    errorMap: () => ({ message: "Invalid completion status" }),
  }),
});


export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
