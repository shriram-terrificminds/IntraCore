
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
    <header className="h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* <SidebarTrigger /> */}
        <span className="text-sm text-muted-foreground">Inventory & Complaint Management</span>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            3
          </Badge>
        </Button>

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
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col items-start space-y-2 pb-2 w-full">
                <Avatar className="h-14 w-14 mx-auto">
                  <AvatarImage src={user?.profile_image || 'https://randomuser.me/api/portraits/men/1.jpg'} alt={`${user?.first_name} ${user?.last_name}`} />
                  <AvatarFallback>{user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 w-full">
                  <p className="text-sm font-medium leading-none">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <div className="flex w-full items-center justify-between">
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
