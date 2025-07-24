import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User, UserRole, UserLocation } from '@/types';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (userData: Partial<User> & { password?: string }) => void;
}

export function CreateUserDialog({ open, onOpenChange, onCreateUser }: CreateUserDialogProps) {
  const [formData, setFormData] = useState<Partial<User> & { password?: string }>({
    first_name: '',
    last_name: '',
    email: '',
    location: undefined,
    role: undefined,
    profile_image: '',
    password: '',
  });

  const { toast } = useToast();

  const staticRoles: UserRole[] = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Hr' },
    { id: 3, name: 'Devops' },
    { id: 4, name: 'Employee' },
  ];
  const staticLocations: UserLocation[] = [
    { id: 1, name: 'Kochi' },
    { id: 2, name: 'Trivandrum' },
    { id: 3, name: 'Bangalore' },
    { id: 4, name: 'Perth' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.location || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including password",
        variant: "destructive"
      });
      return;
    }
    if (formData.password && formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }
    onCreateUser({
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      location: undefined,
      role: undefined,
      profile_image: '',
      password: '',
    });
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, profile_image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getAvatarInitials = () => {
    const firstName = formData.first_name || '';
    const lastName = formData.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create New User
          </DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Fallback Only */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarFallback>
                {getAvatarInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password (min 8 characters)"
              required
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Password must be at least 8 characters long
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role?.id?.toString() || ''} onValueChange={(value) => {
              const roleObj = staticRoles.find(r => r.id.toString() === value);
              setFormData(prev => ({ ...prev, role: roleObj }));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                {staticRoles.map(role => (
                  <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select value={formData.location?.id?.toString() || ''} onValueChange={(value) => {
              const locationObj = staticLocations.find(l => l.id.toString() === value);
              setFormData(prev => ({ ...prev, location: locationObj }));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {staticLocations.map(loc => (
                  <SelectItem key={loc.id} value={loc.id.toString()}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
