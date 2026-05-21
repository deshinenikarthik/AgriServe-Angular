export interface Farmer {
  farmerId: number;      
  name: string;
  dob: string;           
  gender: string;
  address: string;
  contactInfo: string;
  landSize: number;      
  cropType: string;      
  status: string;
}
 
export interface Workshop {
  workshopId: number;
  programId: number;
  programTitle: string;
  title: string;
  location: string;
  date: any;
  status: string;
  description: string; 
}
 
export interface Document {
  documentId: number;    
  docType: string;
  fileURI: string;       
  uploadedDate: string | Date; 
  verificationStatus: 'Accepted' | 'Pending' | 'Rejected';
  farmerId: number;      
}
 
export interface TrainingProgram {
  programId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;   
  status: string;
  managerId: number;
}
 
export interface AdvisoryContent {
  contentId: number;
  title: string;
  category: string;
  description: string;
  fileUri: string;
  status: string;    
}