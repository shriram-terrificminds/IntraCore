
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateUser: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    location: string;
    joinedDate: string;
    role: 'admin' | 'member' | 'devops' | 'hr';
    profileImage?: string;
  }) => void;
}

export function CreateUserDialog({ open, onOpenChange, onCreateUser }: CreateUserDialogProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    role: '' as 'admin' | 'member' | 'devops' | 'hr',
    profileImage: ''
  });
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.location || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onCreateUser({
      ...formData,
      joinedDate: new Date().toISOString().split('T')[0],
      profileImage: formData.profileImage || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face`
    });
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      location: '',
      role: '' as 'admin' | 'member' | 'devops' | 'hr',
      profileImage: ''
    });
    
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
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.profileImage} alt="Profile" />
              <AvatarFallback>
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <Label htmlFor="profile-image" className="cursor-pointer">
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </div>
              </Label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
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
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.role} onValueChange={(value: 'admin' | 'member' | 'devops' | 'hr') => 
              setFormData(prev => ({ ...prev, role: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select value={formData.location} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, location: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select office location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New York Office">New York Office</SelectItem>
                <SelectItem value="London Office">London Office</SelectItem>
                <SelectItem value="California Office">California Office</SelectItem>
                <SelectItem value="Toronto Office">Toronto Office</SelectItem>
                <SelectItem value="Singapore Office">Singapore Office</SelectItem>
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
