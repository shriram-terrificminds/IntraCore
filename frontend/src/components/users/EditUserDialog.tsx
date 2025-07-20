
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  role: number; // 1=Admin, 2=HR, 3=DevOps, 4=Employee
  profileImage?: string;
  joinedDate: string;
  lastEditedBy: string;
  lastEditedTime: string;
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onEditUser: (userData: Partial<User>) => void;
}

export function EditUserDialog({ open, onOpenChange, user, onEditUser }: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    role: 4 as number,
    profileImage: '',
    password: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        location: user.location || '',
        role: user.role || 4,
        profileImage: user.profileImage || '',
        password: ''
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const updateData: Partial<User> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      location: formData.location,
      role: formData.role,
      profileImage: formData.profileImage
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
    const firstName = formData.firstName || '';
    const lastName = formData.lastName || '';
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
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.profileImage} alt="Profile" />
              <AvatarFallback>
                {getAvatarInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <Label htmlFor="edit-profile-image" className="cursor-pointer">
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50">
                  <Upload className="h-4 w-4" />
                  Change Photo
                </div>
              </Label>
              <input
                id="edit-profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="editFirstName">First Name *</Label>
              <Input
                id="editFirstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editLastName">Last Name *</Label>
              <Input
                id="editLastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
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
            <Select value={formData.role.toString()} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, role: parseInt(value) }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Admin</SelectItem>
                <SelectItem value="2">HR</SelectItem>
                <SelectItem value="3">DevOps</SelectItem>
                <SelectItem value="4">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="editLocation">Location *</Label>
            <Select value={formData.location} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, location: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select office location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TVM">TVM</SelectItem>
                <SelectItem value="Ernakulam">Ernakulam</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
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
