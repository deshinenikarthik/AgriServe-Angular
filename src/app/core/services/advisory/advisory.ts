import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdvisoryContent } from '../../../models/advisory.models';
import { UploadAdvisoryContent, AdvisorySessionRequest, AdvisorySessionResponse } from '../../../models/advisory.models';


@Injectable({
  providedIn: 'root',
})
export class AdvisoryService {
  
  // 🚨 Change this URL to match your actual API Gateway or Microservice route!
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all advisory content to populate the library grid.
   */
  getAllContent(): Observable<AdvisoryContent[]> {
    return this.http.get<AdvisoryContent[]>(`${this.baseUrl}/advisory-content/active`);
  }


  /**
   * Uploads a new advisory document (Used by Extension Officers / Admins).
   * Note: If you are uploading PDF files, 'content' might need to be FormData instead of a standard object.
   */
  createContent(content: Partial<UploadAdvisoryContent>): Observable<UploadAdvisoryContent> {
    return this.http.post<UploadAdvisoryContent>(`${this.baseUrl}/advisory-content/upload`, content);
  }

  /**
   * Deletes an advisory document from the library.
   */
  deleteContent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/advisory-content/${id}`);
  }

  getUsageReport(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/advisory-sessions/reports/usage`);
  }

  getMyWorkshops(officerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/workshops/officer/${officerId}`); 
  }

  // Fetch All Sessions
  getAllSessions(): Observable<AdvisorySessionResponse[]> {
    return this.http.get<AdvisorySessionResponse[]>(`${this.baseUrl}/advisory-sessions`); 
  }

  // Fetch Dropdown Data
  getFarmers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/farmers/all`); 
  }

  getActiveContent(): Observable<AdvisoryContent[]> {
    return this.http.get<AdvisoryContent[]>(`${this.baseUrl}/advisory-content/active`); 
  }

  // Save a new Session
  createSession(payload: AdvisorySessionRequest): Observable<AdvisorySessionRequest> {
    return this.http.post<AdvisorySessionRequest>(`${this.baseUrl}/advisory-sessions/log`, payload); 
  }
}