
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  userRole: 'admin' | 'employee' | 'devops' | 'hr';
  setUserRole: (role: 'admin' | 'employee' | 'devops' | 'hr') => void;
}

export function Header({ userRole, setUserRole }: HeaderProps) {
  const handleProfileClick = () => {
    const roles: ('admin' | 'employee' | 'devops' | 'hr')[] = ['admin', 'employee', 'devops', 'hr'];
    const currentIndex = roles.indexOf(userRole);
    const nextIndex = (currentIndex + 1) % roles.length;
    setUserRole(roles[nextIndex]);
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div>
          <h1 className="text-xl font-semibold">IntraCore</h1>
          <p className="text-sm text-muted-foreground">Inventory & Complaint Management</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            3
          </Badge>
        </Button>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleProfileClick}
          title={`Current role: ${userRole.toUpperCase()} - Click to switch roles`}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
