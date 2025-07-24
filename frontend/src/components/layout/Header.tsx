
import { Bell, User, LogOut, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { SidebarTrigger } from '@/components/ui/sidebar'; // Removed as sidebar is always visible
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  // userRole: UserRole; // This prop will now be derived from AuthContext.user.role
  // setUserRole: (role: UserRole) => void; // No longer needed as role is from auth context
}

export function Header({}: HeaderProps) {
  const { user, logout } = useAuth();

  // const handleProfileClick = () => {
  //   const roles: UserRole[] = ['admin', 'employee', 'devops', 'hr', 'member'];
  //   const currentIndex = roles.indexOf(userRole);
  //   const nextIndex = (currentIndex + 1) % roles.length;
  //   setUserRole(roles[nextIndex]);
  // };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* <SidebarTrigger /> */}
        <span className="text-sm text-muted-foreground">Inventory & Complaint Management</span>
      </div>

      <div className="flex items-center gap-4">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-10 w-10 rounded-full"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.profile_image} alt={`${user?.first_name} ${user?.last_name}`} />
                <AvatarFallback>{user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-3" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-0">
              <div className="flex flex-col items-center space-y-3 pb-3 w-full border-b border-muted-foreground/10">
                <Avatar className="h-16 w-16 mb-1">
                  <AvatarImage src={user?.profile_image || 'https://randomuser.me/api/portraits/men/1.jpg'} alt={`${user?.first_name} ${user?.last_name}`} />
                  <AvatarFallback>{user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center w-full">
                  <p className="text-base font-semibold leading-none mt-2 mb-1">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs leading-none text-muted-foreground mb-2">{user?.email}</p>
                  <div className="flex w-full items-center justify-between gap-4 mt-2 mb-2">
                    <span className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                      <User className="h-3 w-3" /> {user?.role.name}
                    </span>
                    <span className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {user?.location.name}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted-foreground/5 transition">
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
