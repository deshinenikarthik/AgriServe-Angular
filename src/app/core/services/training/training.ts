import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { 
  TrainingProgram, 
  TrainingProgramRequest, 
  Workshop, 
  WorkshopRequest, 
  Participation, 
  AttendanceUpdateRequest 
} from '../../../models/training.models';


@Injectable({ providedIn: 'root' })
export class TrainingService {

  private http = inject(HttpClient);

  // ✅ KEEP — direct microservice URL (no gateway). Change to gateway URL in production.
  private apiUrl = 'http://localhost:8081/api';

  
  // ─────────────────────────────────────────
  private getAuthHeaders(role: string, userId: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Logged-In-User-Id': userId,
      'X-User-Role': 'ROLE_' + role  // Spring Security expects the ROLE_ prefix
    });
  }

  // ─────────────────────────────────────────
  // ⚠️  TESTING ONLY — Hardcoded User IDs
  //
  // WHAT TO DO AFTER TESTING:
  //   Read these from a decoded JWT token or a user-profile state service.
  //   e.g., this.authService.getCurrentUserId()
  // ─────────────────────────────────────────
  private readonly TEST_MANAGER_ID = '101';
  private readonly TEST_OFFICER_ID = '301';
  private readonly TEST_FARMER_ID  = '401';

  // ═══════════════════════════════════════
  // PROGRAM ENDPOINTS
  // ═══════════════════════════════════════

  /** GET /api/programs — Accessible by ProgramManager, Admin, Farmer, ExtensionOfficer */
  getAllPrograms(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/programs`, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  /** GET /api/programs/{id} — Accessible by ProgramManager, Admin, ExtensionOfficer */
  getProgramById(programId: number): Observable<TrainingProgram> {
    return this.http.get<TrainingProgram>(`${this.apiUrl}/programs/${programId}`, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  /** POST /api/programs — Accessible by ProgramManager, Admin, ExtensionOfficer */
  createProgram(programData: TrainingProgramRequest): Observable<TrainingProgram> {
    return this.http.post<TrainingProgram>(`${this.apiUrl}/programs`, programData, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  /** PUT /api/programs/{id} — Accessible by ProgramManager, Admin, ExtensionOfficer */
  updateProgram(programId: number, programData: TrainingProgramRequest): Observable<TrainingProgram> {
    return this.http.put<TrainingProgram>(`${this.apiUrl}/programs/${programId}`, programData, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  /** DELETE /api/programs/{id} — Accessible by ProgramManager, Admin, ExtensionOfficer */
  deleteProgram(programId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/programs/${programId}`, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  /** GET /api/programs/completed — Accessible by ProgramManager, Admin, ComplianceOfficer, ExtensionOfficer */
  getCompletedPrograms(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.apiUrl}/programs/completed`, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  // ═══════════════════════════════════════
  // WORKSHOP ENDPOINTS
  // ═══════════════════════════════════════

  /** GET /api/workshops/{id} — Accessible by ProgramManager, Admin, ExtensionOfficer, Farmer */
  getWorkshopById(workshopId: number): Observable<Workshop> {
    return this.http.get<Workshop>(`${this.apiUrl}/workshops/${workshopId}`, {
      headers: this.getAuthHeaders('ExtensionOfficer', this.TEST_OFFICER_ID)
    });
  }

  /** GET /api/workshops — Accessible by ProgramManager, Admin, Farmer */
  getAllWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`${this.apiUrl}/workshops`, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  /** GET /api/workshops/active — Accessible by ProgramManager, Admin, Farmer */
  getActiveWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`${this.apiUrl}/workshops/active`, {
      headers: this.getAuthHeaders('Farmer', this.TEST_FARMER_ID)
    });
  }

  /** GET /api/workshops/officer/{officerId} — Accessible by ProgramManager, Admin, ExtensionOfficer */
  getWorkshopsByOfficer(officerId: number): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`${this.apiUrl}/workshops/officer/${officerId}`, {
      headers: this.getAuthHeaders('ExtensionOfficer', this.TEST_OFFICER_ID)
    });
  }

  /** GET /api/workshops/program/{programId} — Accessible by ProgramManager, Admin, ExtensionOfficer */
  getWorkshopsByProgram(programId: number): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`${this.apiUrl}/workshops/program/${programId}`, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  /** POST /api/workshops — Accessible by ProgramManager, Admin */
  scheduleWorkshop(workshopData: WorkshopRequest): Observable<Workshop> {
    return this.http.post<Workshop>(`${this.apiUrl}/workshops`, workshopData, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  /** PUT /api/workshops/{id} — Accessible by ProgramManager, Admin */
  updateWorkshop(workshopId: number, workshopData: WorkshopRequest): Observable<Workshop> {
    return this.http.put<Workshop>(`${this.apiUrl}/workshops/${workshopId}`, workshopData, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  /**
   * PATCH /api/workshops/{id}/status?status= — Accessible by ProgramManager, Admin, ExtensionOfficer
   * Valid statuses: "Scheduled", "Completed", "Cancelled"
   */
  updateWorkshopStatus(workshopId: number, status: string): Observable<Workshop> {
    return this.http.patch<Workshop>(
      `${this.apiUrl}/workshops/${workshopId}/status?status=${status}`,
      {},
      { headers: this.getAuthHeaders('ExtensionOfficer', this.TEST_OFFICER_ID) }
    );
  }

  /** DELETE /api/workshops/{id} — Accessible by ProgramManager, Admin */
  deleteWorkshop(workshopId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/workshops/${workshopId}`, {
      headers: this.getAuthHeaders('ProgramManager', this.TEST_MANAGER_ID)
    });
  }

  // ═══════════════════════════════════════
  // PARTICIPATION ENDPOINTS
  // ═══════════════════════════════════════

  /**
   * POST /api/participations/register — Accessible by Farmer
   * NOTE: farmerId is intentionally NOT sent in body — backend injects it from X-Logged-In-User-Id header.
   */
  registerForWorkshop(workshopId: number): Observable<Participation> {
    // ⚠️ TESTING ONLY: farmerId in the payload is ignored by the backend
    // (it fetches farmerId via Feign from the farmer-service using X-Logged-In-User-Id).
    // The payload only needs workshopId.
    const payload = { workshopId: workshopId };
    return this.http.post<Participation>(`${this.apiUrl}/participations/register`, payload, {
      headers: this.getAuthHeaders('Farmer', this.TEST_FARMER_ID)
    });
  }

  /** GET /api/participations/workshop/{workshopId} — Accessible by ExtensionOfficer, ProgramManager, Admin */
  getParticipantsForWorkshop(workshopId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/participations/workshop/${workshopId}`, {
      headers: this.getAuthHeaders('ExtensionOfficer', this.TEST_OFFICER_ID)
    });
  }

  /**
   * GET /api/participations/farmer/{farmerId} — Accessible by ExtensionOfficer, ProgramManager, Admin
   * ⚠️ TESTING ONLY: hardcoded farmerId. In production, derive from JWT.
   */
  getParticipationByFarmer(farmerId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/participations/farmer/${farmerId}`, {
      // ⚠️ TESTING ONLY: Using officer role because farmer role is NOT authorized for this endpoint.
      // The backend GET /participations/farmer/{id} requires ExtensionOfficer, ProgramManager, or Admin.
      // In production, this should be called server-side or via a dedicated farmer-profile endpoint.
      headers: this.getAuthHeaders('ExtensionOfficer', this.TEST_OFFICER_ID)
    });
  }

  /** PUT /api/participations/attendance — Accessible by ExtensionOfficer, Admin */
  updateSingleAttendance(request: AttendanceUpdateRequest): Observable<Participation> {
    return this.http.put<Participation>(`${this.apiUrl}/participations/attendance`, request, {
      headers: this.getAuthHeaders('ExtensionOfficer', this.TEST_OFFICER_ID)
    });
  }

  /** Bulk attendance — fires multiple PUT requests in parallel */
  submitBulkAttendance(updates: AttendanceUpdateRequest[]): Observable<Participation[]> {
    const requests = updates.map(update => this.updateSingleAttendance(update));
    return forkJoin(requests);
  }
}