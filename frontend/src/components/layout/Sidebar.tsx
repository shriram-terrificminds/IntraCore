import {
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Settings,
  User,
  BarChart3,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: "admin" | "member" | "devops" | "hr";
}

export function Sidebar({ activeTab, setActiveTab, userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMenuItems = () => {
    const baseItems = [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "inventory", label: "Inventory", icon: ListChecks },
      { id: "complaints", label: "Complaints", icon: MessageSquare },
    ];

    const roleSpecificItems = [];

    // Admin gets full access
    if (userRole === "admin") {
      roleSpecificItems.push(
        { id: "users", label: "Users", icon: User },
        { id: "announcements", label: "Announcements", icon: Settings },
        { id: "reports", label: "Reports", icon: BarChart3 }
      );
    }
    // DevOps gets technical features
    else if (userRole === "devops") {
      roleSpecificItems.push(
        { id: "announcements", label: "Announcements", icon: Settings }
      );
    }
    // HR gets user management and announcements
    else if (userRole === "hr") {
      roleSpecificItems.push(
        { id: "users", label: "Users", icon: User },
        { id: "announcements", label: "Announcements", icon: Settings }
      );
    }
    // Member gets basic access only
    else if (userRole === "member") {
      roleSpecificItems.push(
        { id: "announcements", label: "Announcements", icon: Settings }
      );
    }

    return [...baseItems, ...roleSpecificItems];
  };

  const menuItems = getMenuItems();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden absolute top-2 left-2"
            onClick={() => setIsOpen(true)}
          >
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 flex flex-col gap-4 p-4 z-50"
        >
          <SheetHeader className="pb-4 pl-6">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2">
            <Avatar className="mx-auto">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-semibold">John Doe</p>
              <p className="text-sm text-muted-foreground">
                john.doe@example.com
              </p>
              <div className="mt-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  Role: {userRole.toUpperCase()}
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
        </SheetContent>
      </Sheet>
      <aside className="hidden md:flex flex-col w-64 gap-4 p-4 border-r">
        <div className="flex flex-col gap-2">
          <Avatar className="mx-auto">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold">John Doe</p>
            <p className="text-sm text-muted-foreground">
              john.doe@example.com
            </p>
            <div className="mt-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                Role: {userRole.toUpperCase()}
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
