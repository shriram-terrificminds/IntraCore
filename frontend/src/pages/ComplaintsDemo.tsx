import { useState } from 'react';
import { ComplaintManagement } from '@/components/complaints/ComplaintManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ComplaintsDemo() {
  const [currentRole, setCurrentRole] = useState<'admin' | 'member' | 'devops' | 'hr'>('admin');

  const roles = [
    { id: 'admin', name: 'Admin', description: 'Full access to all complaints and status updates' },
    { id: 'hr', name: 'HR', description: 'Can view and update complaint statuses' },
    { id: 'devops', name: 'DevOps', description: 'Can view and update complaint statuses' },
    { id: 'member', name: 'Employee', description: 'Can create complaints but cannot update status' },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Complaint Management System</h1>
          <p className="text-muted-foreground mt-2">
            Demo showcasing the complaint management features with role-based access control
          </p>
        </div>
      </div>

      {/* Role Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Current User Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Button
                key={role.id}
                variant={currentRole === role.id ? 'default' : 'outline'}
                onClick={() => setCurrentRole(role.id as any)}
                className="flex items-center gap-2"
              >
                {role.name}
                {currentRole === role.id && (
                  <Badge variant="secondary">Active</Badge>
                )}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {roles.find(r => r.id === currentRole)?.description}
          </p>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">📝 Complaint Form</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Title input with validation</li>
              <li>• Role/Department dropdown</li>
              <li>• Multiline description</li>
              <li>• Multiple image upload (max 5)</li>
              <li>• Form validation</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">🃏 Complaint Cards</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Status badges with colors</li>
              <li>• Image previews</li>
              <li>• Resolution notes display</li>
              <li>• Role-based action buttons</li>
              <li>• Detailed complaint info</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">🔧 Status Updates</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Admin/HR/DevOps can update</li>
              <li>• Pending → In-progress</li>
              <li>• In-progress → Resolved/Rejected</li>
              <li>• Resolution notes required</li>
              <li>• Employees: read-only</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">🔍 Filters & Search</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Filter by status</li>
              <li>• Filter by role</li>
              <li>• Search by title/#</li>
              <li>• Sort by latest/oldest</li>
              <li>• Real-time filtering</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Main Complaint Management */}
      <ComplaintManagement userRole={currentRole} />
    </div>
  );
} 