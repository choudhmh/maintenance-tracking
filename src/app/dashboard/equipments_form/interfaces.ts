import { MaintenanceType, PriorityLevel, CompletionStatus } from "./enum";

export interface Equipment {
  id: number;
  name: string;
  location: string;
  department: 'Machining' | 'Assembly' | 'Packaging' | 'Shipping';
  model: string;
  serialNumber: string;
  installDate: Date;
  status: 'Operational' | 'Down' | 'Maintenance' | 'Retired';
}
  
  
  export interface MaintenanceRecord {
    id: string;
    equipmentId: number;
    date: string;
    type: MaintenanceType;
    technician: string;
    hoursSpent: number;
    description: string;
    partsReplaced?: string[];
    priority: PriorityLevel;
    completionStatus: CompletionStatus;
  }