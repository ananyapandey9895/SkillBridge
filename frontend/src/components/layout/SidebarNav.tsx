import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ArrowLeftRight, CalendarClock, LogOut, ChevronUp } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/skills', label: 'Skills', icon: BookOpen },
  { to: '/requests', label: 'Requests', icon: ArrowLeftRight },
  { to: '/sessions', label: 'Sessions', icon: CalendarClock },
];

const SidebarNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="py-4 px-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-foreground text-background text-[10px] font-bold shrink-0 tracking-tight">
            SB
          </div>
          <span className="font-semibold text-sm tracking-tight group-data-[collapsible=icon]:hidden">
            SkillBridge
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="pt-1">
        <SidebarMenu>
          {navItems.map(({ to, label, icon: Icon }) => (
            <SidebarMenuItem key={to}>
              <NavLink to={to}>
                {({ isActive }) => (
                  <SidebarMenuButton isActive={isActive} tooltip={label} className="gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="pb-3">
        <SidebarSeparator className="mb-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent transition-colors outline-none"
                aria-label="User menu"
              >
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarFallback className="text-[10px] font-semibold bg-foreground text-background">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start min-w-0 group-data-[collapsible=icon]:hidden flex-1">
                  <span className="text-sm font-medium leading-tight truncate w-full">{user?.name}</span>
                  <span className="text-xs text-muted-foreground capitalize leading-tight">{user?.role}</span>
                </div>
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-44">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-sm">
                  <LogOut className="h-3.5 w-3.5" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
