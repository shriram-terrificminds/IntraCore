
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '../../types';

interface AnnouncementsProps {
  userRole: string;
}

type UserRole = 'admin' | 'hr' | 'devops' | 'member';

type Location = 'Kochi' | 'Trivandrum' | 'Bangalore' | 'All';

type ToRole = 'admin' | 'hr' | 'devops' | 'all';

interface Announcement {
  id: string;
  content: string;
  author: string;
  authorRole: UserRole;
  date: string;
  toRole: ToRole;
  location: Location;
}

const ROLE_OPTIONS: ToRole[] = ['admin', 'hr', 'devops', 'all'];
const LOCATION_OPTIONS: Location[] = ['Kochi', 'Trivandrum', 'Bangalore', 'All'];

// Helper to check if user can send
function canSendRole(role: string): boolean {
  return role === 'admin' || role === 'hr' || role === 'devops';
}
// Helper to capitalize first letter
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function Announcements({ userRole }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      content: 'Welcome everyone to our new chat-based announcement system! 🎉',
      author: 'Admin',
      authorRole: 'admin',
      date: '2024-07-09T15:30',
      toRole: 'all',
      location: 'All',
    },
    {
      id: '2',
      content: 'The New York office will have maintenance this weekend. Please plan accordingly. 🛠️',
      author: 'Admin',
      authorRole: 'admin',
      date: '2024-07-09T15:45',
      toRole: 'all',
      location: 'Kochi',
    },
    {
      id: '3',
      content: 'New coffee machine installed in the London office pantry! ☕',
      author: 'Sarah Wilson',
      authorRole: 'hr',
      date: '2024-07-09T17:00',
      toRole: 'all',
      location: 'Trivandrum',
    },
    {
      id: '4',
      content: 'Team meeting scheduled for Friday at 2 PM in the California office conference room.',
      author: 'Admin',
      authorRole: 'admin',
      date: '2024-07-09T17:30',
      toRole: 'all',
      location: 'Bangalore',
    },
  ]);

  const [message, setMessage] = useState('');
  const [toRole, setToRole] = useState<ToRole>('all');
  const [toLocation, setToLocation] = useState<Location>('All');
  const [locationFilter, setLocationFilter] = useState<Location>('All');

  // Only show send box for admin/hr/devops
  const canSend = canSendRole(String(userRole));

  const filteredAnnouncements = announcements.filter(a =>
    (locationFilter === 'All' || a.location === locationFilter)
  );

  const handleSend = () => {
    if (!message.trim()) return;
    setAnnouncements(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content: message,
        author: capitalize(String(userRole)),
        authorRole: String(userRole) as UserRole,
        date: new Date().toISOString(),
        toRole,
        location: toLocation,
      },
    ]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Team Chat</h1>
        <div className="w-56">
          <Select value={locationFilter} onValueChange={v => setLocationFilter(v as Location)}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              {LOCATION_OPTIONS.map(loc => (
                <SelectItem key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Card className="flex-1 overflow-y-auto bg-muted p-6 rounded-lg">
        <div className="flex flex-col gap-4">
          {filteredAnnouncements.length === 0 && (
            <div className="text-center text-muted-foreground">No announcements yet.</div>
          )}
          {filteredAnnouncements.map((a, idx) => (
            <div key={a.id} className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-primary text-white">{a.author}</Badge>
                <Badge variant="outline">{a.authorRole.toUpperCase()}</Badge>
                <Badge variant="outline">{a.location}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleString()}</span>
              </div>
              <div className="bg-background border rounded-xl px-4 py-2 shadow max-w-xl">
                <span className="text-base">{a.content}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {/* Send box for allowed roles only */}
      {canSend && (
        <div className="flex items-end gap-2 mt-4">
          <div className="flex items-center gap-2 w-40">
            <span className="text-muted-foreground text-sm">To:</span>
            <Select value={toRole} onValueChange={v => setToRole(v as ToRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map(role => (
                  <SelectItem key={role} value={role}>{role === 'all' ? 'All Roles' : role.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-40">
            <Select value={toLocation} onValueChange={v => setToLocation(v as Location)}>
              <SelectTrigger>
                <SelectValue placeholder="To Location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_OPTIONS.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            className="flex-1"
            placeholder="Type your announcement..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            size="icon"
            className="bg-primary text-white hover:bg-primary/90 rounded-full shadow-md"
            aria-label="Send announcement"
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
