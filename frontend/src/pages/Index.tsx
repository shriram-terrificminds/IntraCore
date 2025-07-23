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
import { AuthPage } from '@/components/auth/AuthPage';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userRole={user?.role?.name?.toLowerCase()} />;
      case 'inventory':
        return <InventoryRequests userRole={user?.role?.name?.toLowerCase()} />;
      case 'complaints':
        return <ComplaintManagement userRole={user?.role?.name?.toLowerCase()} />;
      case 'announcements':
        return <Announcements userRole={user?.role?.name?.toLowerCase()} />;
      case 'users':
        return <UserManagement userRole={user?.role?.name?.toLowerCase()} />;
      case 'reports':
        return <Reports userRole={user?.role?.name?.toLowerCase()} />;
      default:
        return <Dashboard userRole={user?.role?.name?.toLowerCase()} />;
    }
  };

  return (
    <SidebarProvider>
      {user ? (
        <div className="min-h-screen flex w-full bg-background">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              {renderContent()}
            </main>
          </div>
        </div>
      ) : (
        <AuthPage />
      )}
    </SidebarProvider>
  );
};

export default Index;
