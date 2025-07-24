export interface UserRole {
  id: number;
  name: 'Admin' | 'Devops' | 'Hr' | 'Employee';
}

export interface UserLocation {
  id: number;
  name: 'Kochi' | 'Trivandrum' | 'Bangalore' | 'Perth';
}

// Static arrays for roles and locations
export const USER_ROLES: UserRole[] = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Devops' },
  { id: 3, name: 'Hr' },
  { id: 4, name: 'Employee' },
];

export const USER_LOCATIONS: UserLocation[] = [
  { id: 1, name: 'Kochi' },
  { id: 2, name: 'Trivandrum' },
  { id: 3, name: 'Bangalore' },
  { id: 4, name: 'Perth' },
];

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  location: UserLocation;
  password?: string;
  profile_image?: string | null;
  player_id?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
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

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
} 