import { z } from "zod";

export const equipmentList = ["Machine A", "Machine B", "Machine C"] as const;
export const maintenanceTypes = ["Preventive", "Repair", "Emergency"] as const;
export const priorities = ["Low", "Medium", "High"] as const;
export const completionStatuses = ["Complete", "Incomplete", "Pending Parts"] as const;
export const department = ["Machining", "Assembly", "Packaging", "Shipping"] as const;
export const statusValues = ["Operational", "Down", "Maintenance", "Retired"] as const;

// ✅ Equipment Form Schema
export const equipmentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  location: z.string().min(1, "Location is required"),
  department: z.enum(department, { message: "Invalid department" }),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().regex(/^[a-zA-Z0-9]+$/, "Serial Number must be alphanumeric"),
  installDate: z.string().refine((val) => new Date(val) < new Date(), "Install Date must be a past date"),
  status: z.enum(statusValues, { message: "Invalid status" }),
});

export type EquipmentFormData = z.infer<typeof equipmentSchema>;

// ✅ Maintenance Form Schema
export const maintenanceSchema = z.object({
  equipment: z.enum(equipmentList, { message: "Equipment is required" }),
  date: z.string().refine((val) => new Date(val) <= new Date(), "Date cannot be in the future"),
  type: z.enum(maintenanceTypes, { message: "Invalid maintenance type" }),
  technician: z.string().min(2, "Technician name must be at least 2 characters long"),
  hoursSpent: z.number().positive("Hours must be a positive number").max(24, "Cannot exceed 24 hours"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  partsReplaced: z.array(z.string()).optional(),
  priority: z.enum(priorities, { message: "Invalid priority" }),
  completionStatus: z.enum(completionStatuses, { message: "Invalid status" }),
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
