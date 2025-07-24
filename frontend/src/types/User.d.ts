export type UserRole = 'admin' | 'employee' | 'devops' | 'hr' | 'member';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: { id: string; name: UserRole; description: string; };
  location: { id: string; name: string; description: string; };
  profile_image?: string;
} 