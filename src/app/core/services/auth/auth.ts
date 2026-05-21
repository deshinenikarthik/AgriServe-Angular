import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// This matches your Spring Boot LoginRequestDTO
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  contactInfo: string;
  password: string;
  role: string;
  dob: string;
  gender: string;
  address: string;
  landSize: number;
  cropType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Replace with your actual Spring Boot backend URL
  private apiUrl = 'http://localhost:8081/auth'; 

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }
}