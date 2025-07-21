import { useState } from 'react';
import { Reports } from '@/components/reports/Reports';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ROLES = [
  { id: 'admin', name: 'Admin' },
  { id: 'hr', name: 'HR' },
  { id: 'devops', name: 'DevOps' },
  { id: 'employee', name: 'Employee' },
];

export default function ReportsDemo() {
  const [role, setRole] = useState<'admin' | 'hr' | 'devops' | 'employee'>('admin');
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {ROLES.map(r => (
          <Button
            key={r.id}
            variant={role === r.id ? 'default' : 'outline'}
            onClick={() => setRole(r.id as any)}
            className="flex items-center gap-2"
          >
            {r.name}
            {role === r.id && <Badge variant="secondary">Active</Badge>}
          </Button>
        ))}
      </div>
      <Reports userRole={role} assignedLocations={role === 'admin' ? ['TVM', 'Ernakulam', 'Bangalore'] : ['TVM']} />
    </div>
  );
} 