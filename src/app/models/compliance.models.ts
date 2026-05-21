// ==========================================
// COMPLIANCE MODULE MODELS
// These interfaces perfectly match your Spring Boot Backend DTOs.
// ==========================================

/**
 * Payload used when submitting a new compliance record via the form.
 * Endpoint: POST /api/compliance-records
 */
export interface ComplianceRecordPayload {
  entityId: number;
  type: string; // e.g., 'TRAINING_PROGRAM', 'ADVISORY_SESSION'
  result: string;
  notes: string;
}

/**
 * Represents a completed Compliance Record fetched from the database.
 * Used in the "All Compliance Records" tab.
 */
export interface ComplianceRecordDTO {
  complianceId: number;
  entityId: number;
  type: string;
  officerId: number;
  officerName: string;
  result: string;
  date: string;       
  notes: string;
}

/**
 * Represents a scheduled or completed Training Program.
 * Endpoint: GET /api/programs
 */
export interface TrainingProgramDTO {
  programId: number;
  title: string;
  description: string; 
  startDate: string;
  endDate: string;
  status: string; // e.g., 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'
  managerId: number;   
}

/**
 * Represents a 1-on-1 Advisory Session between a farmer and an officer.
 * Endpoint: GET /api/advisory-sessions
 */
export interface AdvisorySessionDTO {
  sessionId: number;
  farmerName: string;
  officerName: string;
  contentTitle: string;
  date: string;
  status: string; // e.g., 'SCHEDULED', 'COMPLETED'
}

/**
 * Payload used when submitting a new audit via the form.
 * Endpoint: POST /api/audits
 */
export interface AuditPayload {
  scope: string;
  findings: string;
  status: string;
}

/**
 * Represents a large-scale farm Audit.
 * Endpoint: GET /api/audits
 */
export interface AuditDTO {
  auditId: number;
  officerId: number;
  officerName: string;
  scope: string;
  findings: string;
  date: string;
  status: string; // e.g., 'IN_PROGRESS', 'COMPLETED', 'PENDING'
}


export interface StatCardData {
  title: string;
  value: number | string;
  border: string;
  bg: string;
  text: string;
  icon: string;
}