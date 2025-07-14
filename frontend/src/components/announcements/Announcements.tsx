
import { ChatAnnouncements } from './ChatAnnouncements';

interface AnnouncementsProps {
  userRole: 'admin' | 'member' | 'devops' | 'hr';
}

export function Announcements({ userRole }: AnnouncementsProps) {
  return <ChatAnnouncements userRole={userRole} />;
}
