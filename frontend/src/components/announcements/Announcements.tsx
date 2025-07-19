
import { ChatAnnouncements } from './ChatAnnouncements';

interface AnnouncementsProps {
  userRole: 'admin' | 'employee' | 'devops' | 'hr';
}

export function Announcements({ userRole }: AnnouncementsProps) {
  return <ChatAnnouncements userRole={userRole} />;
}
