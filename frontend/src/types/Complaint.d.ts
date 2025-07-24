export interface Complaint {
  id: number;
  complaint_number?: string;
  title: string;
  description: string;
  role_id?: number;
  role?: { name: string };
  resolution_status: 'Pending' | 'In-progress' | 'Resolved' | 'Rejected';
  resolution_notes?: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string | null;
  user?: { name?: string; first_name?: string; last_name?: string };
  resolvedBy?: { name: string };
  images?: Array<{ image_url: string }>;
} 