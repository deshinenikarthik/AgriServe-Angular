import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Farmer,
  Workshop,
  Document,
  TrainingProgram,
  AdvisoryContent
} from '../../../models/farmer.models';

@Injectable({
  providedIn: 'root',
})
export class FarmerService {
  private baseUrl = 'http://localhost:8081/api'; 

  constructor(private http: HttpClient) {}

  getFarmer(): Observable<Farmer> {
    return this.http.get<Farmer>(`${this.baseUrl}/farmers/profile`);
  }

  // 👇 FIX: Pass the programId dynamically into the URL
  getWorkshops(programId: number): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`${this.baseUrl}/workshops/program/${programId}`);
  }

  getMyWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`${this.baseUrl}/participations/my-workshops`);  
  }

  registerForWorkshop(workshopId: number): Observable<any> {
    const payload = { workshopId: workshopId };
    return this.http.post(`${this.baseUrl}/participations/register`, payload);
  }

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.baseUrl}/farmers/documents/my-documents`);
  }

  uploadDocument(payload: { farmerId: number; docType: string; fileURI: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/farmers/documents/upload`, payload);
  }

  getAllTrainingPrograms(): Observable<TrainingProgram[]> {
    return this.http.get<TrainingProgram[]>(`${this.baseUrl}/programs`);
  }

  getActiveAdvisoryContent(): Observable<AdvisoryContent[]> {
    return this.http.get<AdvisoryContent[]>(`${this.baseUrl}/advisory-content/active`);
  }
}