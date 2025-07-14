
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  joinedDate: string;
  role: 'admin' | 'member' | 'devops' | 'hr';
  profileImage?: string;
  lastEditedBy: string;
  lastEditedTime: string;
}

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onDeleteUser: () => void;
}

export function DeleteUserDialog({ open, onOpenChange, user, onDeleteUser }: DeleteUserDialogProps) {
  const { toast } = useToast();

  const handleDelete = () => {
    onDeleteUser();
    onOpenChange(false);
    
    toast({
      title: "User Deleted",
      description: `${user?.firstName} ${user?.lastName} has been removed from the system`,
      variant: "destructive"
    });
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex items-center gap-4 mb-4 p-4 border rounded-lg bg-muted/50">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
                <div className="text-sm text-muted-foreground">{user.role} • {user.location}</div>
              </div>
            </div>
            Are you sure you want to delete this user? This action cannot be undone and will permanently remove the user from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
