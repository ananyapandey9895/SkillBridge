import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import SidebarNav from './SidebarNav';

const AppLayout: React.FC = () => (
  <SidebarProvider>
    <SidebarNav />
    <SidebarInset>
      <header className="sticky top-0 z-20 flex h-11 items-center border-b bg-background/80 backdrop-blur-sm px-4">
        <SidebarTrigger className="-ml-1 h-7 w-7" />
      </header>
      <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
    </SidebarInset>
  </SidebarProvider>
);

export default AppLayout;
