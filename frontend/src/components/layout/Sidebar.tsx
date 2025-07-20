import {
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Settings,
  User as UserIcon, // Renamed to avoid conflict with User interface
  BarChart3,
  MapPin,
} from "lucide-react";
import { NavLink } from "react-router-dom";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"; // Removed as mobile sidebar is not needed
// import { Button } from "@/components/ui/button"; // Removed as mobile sidebar trigger is gone
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "inventory", label: "Inventory", icon: ListChecks },
      { id: "complaints", label: "Complaints", icon: MessageSquare },
    ];

    const roleSpecificItems = [];

    const currentUserRole = user?.role?.name?.toLowerCase();

    switch (currentUserRole) {
      case "admin":
        roleSpecificItems.push(
          { id: "users", label: "Users", icon: UserIcon },
          { id: "announcements", label: "Announcements", icon: Settings },
          { id: "reports", label: "Reports", icon: BarChart3 }
        );
        break;
      case "devops":
      case "hr":
        roleSpecificItems.push(
          { id: "announcements", label: "Announcements", icon: Settings },
          { id: "reports", label: "Reports", icon: BarChart3 } // HR/Devops can see reports in your requirement analysis, so keeping this
        );
        break;
      case "employee":
        // Employees only see announcements from the list
        roleSpecificItems.push(
          { id: "announcements", label: "Announcements", icon: Settings }
        );
        break;
      default:
        break;
    }

    return [...baseItems, ...roleSpecificItems];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* <Sheet open={isOpen} onOpenChange={setIsOpen}> */}
      {/* <SheetTrigger asChild> */}
      {/* <Button
            variant="ghost"
            size="sm"
            className="md:hidden absolute top-2 left-2"
            onClick={() => setIsOpen(true)}
          >
            Menu
          </Button> */}
      {/* </SheetTrigger> */}
      {/* <SheetContent
          side="left"
          className="w-64 flex flex-col gap-4 p-4 z-50"
        >
          <SheetHeader className="pb-4 pl-6">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2">
            <Avatar className="mx-auto">
              <AvatarImage src={user?.profile_image || "https://github.com/shadcn.png"} alt={`${user?.first_name} ${user?.last_name}`} />
              <AvatarFallback>
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold">{user?.first_name} {user?.last_name}</p>
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
              <div className="mt-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center justify-center mx-auto gap-1 w-fit">
                  <UserIcon className="h-3 w-3" /> Role: {user?.role.name.toUpperCase()}
                </span>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full flex items-center justify-center mx-auto gap-1 w-fit mt-1">
                  <MapPin className="h-3 w-3" /> {user?.location.name}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={`/?tab=${item.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground ${
                    isActive ? "bg-secondary text-secondary-foreground" : ""
                  }`
                }
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </SheetContent> */}
      <aside className="flex flex-col w-64 gap-4 p-4 border-r">
        <div className="flex flex-col gap-2">
          <Avatar className="mx-auto">
            <AvatarImage src={user?.profile_image || "https://github.com/shadcn.png"} alt={`${user?.first_name} ${user?.last_name}`} />
            <AvatarFallback>
              {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold">{user?.first_name} {user?.last_name}</p>
            <p className="text-sm text-muted-foreground">
              {user?.email}
            </p>
            <div className="mt-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center justify-center mx-auto gap-1 w-fit">
                <UserIcon className="h-3 w-3" /> Role: {user?.role.name.toUpperCase()}
              </span>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full flex items-center justify-center mx-auto gap-1 w-fit mt-1">
                <MapPin className="h-3 w-3" /> {user?.location.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={`/?tab=${item.id}`}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground ${
                  isActive ? "bg-secondary text-secondary-foreground" : ""
                }`
              }
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
}
