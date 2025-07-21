export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'devops' | 'hr' | 'employee';
  location: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryRequest {
  id: number;
  user_id: number;
  item: string;
  quantity: number;
  team: string;
  status: 'pending' | 'approved' | 'delivered';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Complaint {
  id: number;
  user_id: number;
  team: string;
  title: string;
  description: string;
  status: 'pending' | 'verified' | 'resolved';
  verification_notes?: string;
  resolution_notes?: string;
  before_images?: string[];
  after_images?: string[];
  created_at: string;
  updated_at: string;
}

export interface Broadcast {
  id: number;
  user_id: number;
  title: string;
  content: string;
  location?: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamConfig {
  id: number;
  team: string;
  location: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
} 