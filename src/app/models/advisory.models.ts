export interface AdvisoryContent {
  contentId: number;
  title: string;
  category: string;
  description: string;
  fileUri: string;
  status: string;    
}

export interface UploadAdvisoryContent {
    
    title: string;
    category: string;
    fileUri: string;
    description: string;
}

// For sending data to the backend (POST/PUT)
export interface AdvisorySessionRequest {
  farmerId: number;
  contentId: number;
  feedback: string;
}

// For receiving data from the backend (GET)
export interface AdvisorySessionResponse {
  sessionId: number;
  farmerName: string;
  officerName: string;
  contentTitle: string;
  date: string; // Maps to Java's LocalDateTime
  status: string;
  feedback: string;
}