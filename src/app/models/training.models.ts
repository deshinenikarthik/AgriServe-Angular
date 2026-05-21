export interface TrainingProgram {
  programId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  managerId: number;
}

export interface TrainingProgramRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  // 'status' is not sent on CREATE (backend defaults to Draft)
  // but IS sent on UPDATE to allow status changes
  status?: string;
}

export interface Workshop {
  workshopId?: number;
  programId: number;
  programTitle?: string;
  title: string;
  officerId: number;
  location: string;
  date: string;
  status: string;
}

export interface WorkshopRequest {
  programId: number;
  title: string;
  officerId: number;
  location: string;
  date: string; // ISO datetime string — e.g. "2025-06-15T10:00"
}

export interface Participation {
  participationId: number;
  workshopId: number;
  farmerId: number;
  attendanceStatus: string;
  feedback?: string;
}

export interface AttendanceUpdateRequest {
  participationId: number;
  newAttendanceStatus: string; // "Present" or "Absent"
}

export interface FarmerAttendance {
  participationId: number;
  farmerId: number;
  name: string;
  village: string;
  phone: string;
  isPresent: boolean;
  status: string;
}