import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemUser } from '../../../models/admin.models';

@Injectable({
  providedIn: 'root' 
})
export class AdminService {

  private baseUrl = 'http://localhost:8081/api/users'; 

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  getAllUsers(): Observable<SystemUser[]> {
    return this.http.get<SystemUser[]>(`${this.baseUrl}`, { headers: this.getHeaders() });
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, userData);
  }  

  // Deactivate User
  deactivateUser(userId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${userId}/deactivate`, {}, { headers: this.getHeaders() });
  }

  // Delete User
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${userId}`, { headers: this.getHeaders() });
  }
}