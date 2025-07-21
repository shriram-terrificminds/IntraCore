
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, MapPin, Calendar, Trash2 } from 'lucide-react';

interface ChatAnnouncementsProps {
  userRole: 'admin' | 'employee' | 'devops' | 'hr';
}

interface Message {
  id: string;
  content: string;
  sender: string;
  senderRole: 'admin' | 'employee' | 'devops' | 'hr';
  timestamp: string;
  location: string;
  type: 'announcement' | 'message';

}

const locations = [
  'All Locations',
  'Bangalore',
  'Trivandrum',
  'Kochi'
];

export function ChatAnnouncements({ userRole }: ChatAnnouncementsProps) {
  // For demo purposes, simulating assigned location based on role
  // In a real app, this would come from user context/authentication
  const getUserAssignedLocation = () => {
    switch (userRole) {
      case 'hr': return 'Trivandrum'; // HR's working location
      case 'devops': return 'Kochi'; // DevOps working location
      case 'employee': return 'Kochi'; // Employee's working location (changed to Kochi)
      default: return 'All Locations';
    }
  };

  const userAssignedLocation = getUserAssignedLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome everyone to our new chat-based announcement system!',
      sender: 'Admin',
      senderRole: 'admin',
      timestamp: '2025-07-09T10:00:00Z',
      location: 'All Locations',
      type: 'announcement',

    },
    {
      id: '2',
      content: 'The Trivandrum office will have maintenance this weekend. Please plan accordingly.',
      sender: 'Admin',
      senderRole: 'admin',
      timestamp: '2025-07-09T10:15:00Z',
      location: 'Trivandrum',
      type: 'announcement',

    },
    {
      id: '3',
      content: 'New coffee machine installed in the Kochi office pantry!',
      sender: 'Sarah Wilson',
      senderRole: 'devops',
      timestamp: '2025-07-09T11:30:00Z',
      location: 'Kochi',
      type: 'announcement',

    },
    {
      id: '4',
      content: 'Team meeting scheduled for Friday at 2 PM in the Bangalore office conference room.',
      sender: 'Mike Johnson',
      senderRole: 'devops',
      timestamp: '2025-07-09T12:00:00Z',
      location: 'Bangalore',
      type: 'announcement',

    },
    {
      id: '5',
      content: 'Kochi office employees: Please note the new parking guidelines effective next week.',
      sender: 'HR Team',
      senderRole: 'hr',
      timestamp: '2025-07-09T13:00:00Z',
      location: 'Kochi',
      type: 'announcement',

    },
    {
      id: '6',
      content: 'Welcome to all new Kochi team members! Please check your email for onboarding details.',
      sender: 'Admin',
      senderRole: 'admin',
      timestamp: '2025-07-09T14:00:00Z',
      location: 'Kochi',
      type: 'announcement',

    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
    const [userLocation, setUserLocation] = useState(() => {
    // Set initial location based on role
    let initialLocation;
    if (userRole === 'admin') {
      initialLocation = 'All Locations';
    } else if (userRole === 'hr') {
      initialLocation = getUserAssignedLocation(); // HR starts with their working location
    } else if (userRole === 'employee') {
      initialLocation = getUserAssignedLocation(); // Employee starts with their working location
    } else {
      initialLocation = getUserAssignedLocation(); // DevOps starts with their working location
    }
    

    
    return initialLocation;
  });



  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !['admin', 'hr', 'devops'].includes(userRole)) return;

    // Get sender name based on role
    const getSenderName = () => {
      switch (userRole) {
        case 'admin': return 'Admin';
        case 'hr': return 'HR Team';
        case 'devops': return 'DevOps Team';
        default: return 'System';
      }
    };

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: getSenderName(),
      senderRole: userRole,
      timestamp: new Date().toISOString(),
      location: selectedLocation,
      type: 'announcement'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // TODO: Trigger notification system here
    // This would send email and in-app notifications to users in the selected location
    console.log(`Notification sent to users in ${selectedLocation} for role ${userRole}`);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
    console.log(`Message ${messageId} deleted by ${userRole}`);
  };





  const filteredMessages = messages.filter(message => {
    // Admin can see all messages
    if (userRole === 'admin') {
      return userLocation === 'All Locations' || 
             message.location === 'All Locations' || 
             message.location === userLocation;
    }
    
    // HR can see all messages (but initial view is their working location)
    if (userRole === 'hr') {
      return userLocation === 'All Locations' || 
             message.location === 'All Locations' || 
             message.location === userLocation;
    }
    
    // DevOps can only see messages from their working location and "All Locations"
    if (userRole === 'devops') {
      const userAssignedLocation = getUserAssignedLocation();
      return message.location === 'All Locations' || 
             message.location === userAssignedLocation;
    }
    
    // Employee can only see messages from their working location and "All Locations"
    if (userRole === 'employee') {
      const userAssignedLocation = getUserAssignedLocation();
      return message.location === 'All Locations' || 
             message.location === userAssignedLocation;
    }
    
    return false;
  });





  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Announcements</h2>
          <p className="text-muted-foreground">
            Company-wide announcements and updates
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={userLocation} onValueChange={setUserLocation}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => {
                  // Admin can select any location
                  if (userRole === 'admin') {
                    return (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    );
                  }
                  
                  // HR can select any location
                  if (userRole === 'hr') {
                    return (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    );
                  }
                  
                  // DevOps can only see their working location and "All Locations"
                  if (userRole === 'devops') {
                    const userAssignedLocation = getUserAssignedLocation();
                    if (location === 'All Locations' || location === userAssignedLocation) {
                      return (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      );
                    }
                  }
                  
                  // Employee can only see their working location and "All Locations"
                  if (userRole === 'employee') {
                    const userAssignedLocation = getUserAssignedLocation();
                    if (location === 'All Locations' || location === userAssignedLocation) {
                      return (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      );
                    }
                  }
                  
                  return null;
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="flex-shrink-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Announcements
            <Badge variant="secondary" className="ml-2">
              {filteredMessages.length} messages
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={message.senderRole === 'admin' ? 'default' : 'secondary'}
                    className={`text-xs ${
                      message.senderRole === 'admin' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      message.senderRole === 'devops' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      message.senderRole === 'hr' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}
                  >
                    {message.sender} ({message.senderRole.toUpperCase()})
                  </Badge>
                  {message.location !== 'All Locations' && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {message.location}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className={`flex-1 max-w-[80%] rounded-lg p-3 ${
                    message.senderRole === 'admin' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Delete button - only show for messages sent by current user */}
                  {['admin', 'hr', 'devops'].includes(userRole) && message.senderRole === userRole && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMessage(message.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive mt-1"
                      title="Delete message"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>



          {/* Input Area - Only for Admin, HR, DevOps */}
          {['admin', 'hr', 'devops'].includes(userRole) && (
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex flex-col gap-3">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select target location" />
                  </SelectTrigger>
                  <SelectContent>
                   {locations.map((location) => {
                      // Admin can send to any location
                      if (userRole === 'admin') {
                        return (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        );
                      }
                      
                      // HR can send to any location
                      if (userRole === 'hr') {
                        return (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        );
                      }
                      
                      // DevOps can only send to their working location
                      if (userRole === 'devops') {
                        const userAssignedLocation = getUserAssignedLocation();
                        if (location === userAssignedLocation) {
                          return (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          );
                        }
                        return null;
                      }
                      
                      return null;
                    })}
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2 relative">
                  <div className="relative flex-1">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your announcement..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                  </div>
                  
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}