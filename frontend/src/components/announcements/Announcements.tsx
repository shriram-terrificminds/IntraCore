
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Volume2, MessageSquare, Trash2, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewAnnouncementDialog } from './NewAnnouncementDialog';
import { ChatAnnouncements } from './ChatAnnouncements';
import { User } from '../../types'; // Import User to get UserRole

interface AnnouncementsProps {
  userRole: User['role'];
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft' | 'Archived';
  location: string;
}

export function Announcements({ userRole }: AnnouncementsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Office Closure for Holiday',
      content: 'The office will be closed on July 4th for Independence Day.',
      author: 'Admin',
      date: '2024-07-01',
      status: 'Published',
      location: 'All Locations',
    },
    {
      id: '2',
      title: 'System Maintenance Scheduled',
      content: 'Scheduled system maintenance on July 20th from 10 PM to 2 AM.',
      author: 'DevOps',
      date: '2024-07-05',
      status: 'Published',
      location: 'Headquarters',
    },
    {
      id: '3',
      title: 'New HR Policy Update',
      content: 'Review the updated HR policy document on the company intranet.',
      author: 'HR',
      date: '2024-06-28',
      status: 'Draft',
      location: 'All Locations',
    },
  ]);

  const [newAnnouncementOpen, setNewAnnouncementOpen] = useState(false);

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          announcement.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || announcement.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || announcement.location === locationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const handleNewAnnouncement = (title: string, content: string, location: string, status: 'Published' | 'Draft' | 'Archived') => {
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title,
      content,
      author: userRole === 'admin' ? 'Admin' : userRole === 'hr' ? 'HR' : 'DevOps', // Dynamically set author based on role
      date: new Date().toISOString().split('T')[0],
      status,
      location,
    };
    setAnnouncements(prev => [...prev, newAnnouncement]);
  };

  const handleUpdateAnnouncement = (id: string, updatedData: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(announcement => 
      announcement.id === id ? { ...announcement, ...updatedData } : announcement
    ));
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
  };

  const getStatusBadge = (status: Announcement['status']) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">
            Manage company-wide announcements and notifications
          </p>
        </div>
        <div className="flex gap-2">
          {['admin', 'hr', 'devops'].includes(userRole) && (
            <Button onClick={() => setNewAnnouncementOpen(true)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Announcement
            </Button>
          )}
        </div>
      </div>

      {/* Announcement List and Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcement List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Announcements</CardTitle>
            <CardDescription>View and manage all published announcements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Headquarters">Headquarters</SelectItem>
                    <SelectItem value="North Branch">North Branch</SelectItem>
                    <SelectItem value="South Branch">South Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAnnouncements.map(announcement => (
                <Card key={announcement.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg flex items-center gap-2 mb-1">
                        <Volume2 className="h-5 w-5 text-primary" />
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>By {announcement.author}</span>
                        <span>•</span>
                        <span>{announcement.date}</span>
                        <span>•</span>
                        <Badge className={getStatusBadge(announcement.status)}>{announcement.status}</Badge>
                        <span>•</span>
                        <span>{announcement.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {['admin', 'hr', 'devops'].includes(userRole) && ( // Only admin, HR, devops can edit/delete
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Edit Announcement"
                            onClick={() => handleUpdateAnnouncement(announcement.id, { status: 'Archived' })} // Placeholder for actual edit dialog
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Delete Announcement"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Chat Announcements */}
        <ChatAnnouncements userRole={userRole} />
      </div>
      <NewAnnouncementDialog 
        open={newAnnouncementOpen} 
        onOpenChange={setNewAnnouncementOpen}
        onSubmit={handleNewAnnouncement}
      />
    </div>
  );
}
