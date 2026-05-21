import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/login/login'; 
import { RegisterComponent } from './features/auth/register/register';
import { ComplianceDashboardComponent } from './features/compliance/compliancedashboard/compliancedashboard';
import { CompliancerecordnavbarComponent } from './features/compliance/compliancerecordnavbar/compliancerecordnavbar';
import { AllauditsComponent } from './features/compliance/allaudits/allaudits';
import { CompliancerecordformComponent } from './features/compliance/compliancerecordform/compliancerecordform';
import { AuditformComponent } from './features/compliance/auditform/auditform';
import { Home } from './features/home/home';
import { ProfileComponent } from './features/shared/profile/profile';
import { FarmerDashboardComponent } from './features/farmer/farmerdashboard/farmerdashboard';
import { MyDocumentsComponent } from './features/farmer/mydocuments/mydocuments';
import { UploadDocumentsComponent } from './features/farmer/uploaddocuments/uploaddocuments';
import { TrainingComponent } from './features/farmer/trainingprograms/trainingprograms';
import { AdvisoryContentComponent } from './features/farmer/advisorycontent/advisorycontent';
import { AdminDashboardComponent } from './features/admin/admindashboard/admindashboard';
import { AllUsersComponent } from './features/admin/allusers/allusers';
import { AddUserFormComponent } from './features/admin/adduserform/adduserform';
import { OfficerDashboardComponent } from './features/advisory/officerdashboard/officerdashboard';
import { ContentLibraryComponent } from './features/advisory/contentlibrary/contentlibrary';
import { SessionPortalComponent } from './features/advisory/sessionportal/sessionportal';
import { ContentUploadComponent } from './features/advisory/uploadcontent/uploadcontent';
import { ProgrammanagerdashboardComponent } from './features/training/programmanagerdashboard/programmanagerdashboard';
import { ProgramdetailsComponent } from './features/training/programdetails/programdetails';
import { AttendancedetailsComponent } from './features/training/attendancedetails/attendancedetails';




export const routes: Routes = [
  // Home page
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home},

  // Login and Register
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Profile
  { path: 'profile', component: ProfileComponent, 
    canActivate: [authGuard] },
  
  // Role-Specific Dashboards
  // Compliance Officer and Auditor
  { path: 'compliancedashboard', component: ComplianceDashboardComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['COMPLIANCEOFFICER', 'AUDITOR']} },
  { path: 'compliance/records', component: CompliancerecordnavbarComponent,
    canActivate: [authGuard, roleGuard], data: { roles: ['COMPLIANCEOFFICER', 'AUDITOR']} },
  { path: 'compliance/audits', component: AllauditsComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['COMPLIANCEOFFICER', 'AUDITOR']} },
  { path: 'compliance/fill-record', component: CompliancerecordformComponent,
    canActivate: [authGuard, roleGuard], data: { roles: ['COMPLIANCEOFFICER', 'AUDITOR']} },
  { path: 'compliance/auditform', component: AuditformComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['COMPLIANCEOFFICER', 'AUDITOR']} },

  // Farmer
  { path: 'farmerdashboard', component: FarmerDashboardComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['FARMER']} },
  { path: 'farmer/documents', component: MyDocumentsComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['FARMER']} },
  { path: 'documents/upload', component: UploadDocumentsComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['FARMER']} },
  { path: 'farmer/training', component: TrainingComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['FARMER']} },
  { path: 'farmer/advisorycontent', component: AdvisoryContentComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['FARMER']} },

  // Admin
  { path: 'admindashboard', component: AdminDashboardComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN']} },
  { path: 'admin/users', component: AllUsersComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN']} },
  { path: 'admin/users/add', component: AddUserFormComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN']} },
  
  // Extension Officer
  { path: 'officerdashboard', component: OfficerDashboardComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['EXTENSIONOFFICER']} },
  { path: 'officer/advisory/content', component: ContentLibraryComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['EXTENSIONOFFICER']} },
  { path: 'officer/advisory/session', component: SessionPortalComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['EXTENSIONOFFICER']} },
  { path: 'officer/attendance/:id', component: AttendancedetailsComponent,
    canActivate: [authGuard, roleGuard], data: { roles: ['EXTENSIONOFFICER']} },

  // Program Manager
  { path: 'managerdashboard', component: ProgrammanagerdashboardComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['PROGRAMMANAGER']} },
  { path: 'manager/programdetails/:id', component: ProgramdetailsComponent,
    canActivate: [authGuard, roleGuard], data: { roles: ['PROGRAMMANAGER']} },
  { path: 'manager/advisory/upload', component: ContentUploadComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['PROGRAMMANAGER']} },
  { path: 'manager/advisory/content', component: ContentLibraryComponent, 
    canActivate: [authGuard, roleGuard], data: { roles: ['PROGRAMMANAGER']} },
  
];