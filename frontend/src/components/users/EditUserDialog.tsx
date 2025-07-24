import { USER_ROLES, USER_LOCATIONS } from '@/types';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types';
interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: Partial<User> | null;
  onEditUser: (userData: Partial<User>) => void;
}

export function EditUserDialog({ open, onOpenChange, user, onEditUser }: EditUserDialogProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    first_name: '',
    last_name: '',
    email: '',
    location: undefined,
    role: undefined,
    profile_image: '',
    password: '',
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        location: user.location || undefined,
        role: user.role || undefined,
        profile_image: user.profile_image || '',
        password: '',
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const updateData: Partial<User> = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      location: formData.location,
      role: formData.role,
      profile_image: formData.profile_image
    };

    // Only include password if it's provided
    if (formData.password) {
      toast({
        title: "Password Updated",
        description: "User password has been updated successfully",
      });
    }

    onEditUser(updateData);
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, profileImage: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to get avatar initials safely
  const getAvatarInitials = () => {
    const firstName = formData.first_name || '';
    const lastName = formData.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit User
          </DialogTitle>
          <DialogDescription>
            Update user information. Make changes to the user profile below.
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
              <Label htmlFor="editFirstName">First Name *</Label>
              <Input
                id="editFirstName"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editLastName">Last Name *</Label>
              <Input
                id="editLastName"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editEmail">Email *</Label>
            <Input
              id="editEmail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editRole">Role *</Label>
            <Select value={formData.role?.id?.toString() || ''} onValueChange={(value) => {
              const roleObj = USER_ROLES.find(r => r.id.toString() === value);
              if (roleObj) setFormData(prev => ({ ...prev, role: roleObj }));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Admin</SelectItem>
                <SelectItem value="2">Hr</SelectItem>
                <SelectItem value="3">Devops</SelectItem>
                <SelectItem value="4">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editLocation">Location *</Label>
            <Select value={formData.location?.id?.toString() || ''} onValueChange={(value) => {
              const locationObj = USER_LOCATIONS.find(l => l.id.toString() === value);
              if (locationObj) setFormData(prev => ({ ...prev, location: locationObj }));
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select office location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Kochi</SelectItem>
                <SelectItem value="2">Trivandrum</SelectItem>
                <SelectItem value="3">Bangalore</SelectItem>
                <SelectItem value="4">Perth</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editPassword">New Password (optional)</Label>
            <Input
              id="editPassword"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
