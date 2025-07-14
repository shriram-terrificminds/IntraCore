import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { InventoryRequests } from '@/components/inventory/InventoryRequests';
import { ComplaintManagement } from '@/components/complaints/ComplaintManagement';
import { Announcements } from '@/components/announcements/Announcements';
import { UserManagement } from '@/components/users/UserManagement';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Reports } from '@/components/reports/Reports';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'member' | 'devops' | 'hr'>('member');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userRole={userRole} />;
      case 'inventory':
        return <InventoryRequests userRole={userRole} />;
      case 'complaints':
        return <ComplaintManagement userRole={userRole} />;
      case 'announcements':
        return <Announcements userRole={userRole} />;
      case 'users':
        return <UserManagement userRole={userRole} />;
      case 'reports':
        return <Reports userRole={userRole} />;
      default:
        return <Dashboard userRole={userRole} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          userRole={userRole}
        />
        <div className="flex-1 flex flex-col">
          <Header userRole={userRole} setUserRole={setUserRole} />
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
