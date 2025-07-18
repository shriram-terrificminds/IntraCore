
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, MapPin, Smile, Calendar, Heart, ThumbsUp } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';

interface ChatAnnouncementsProps {
  userRole: 'admin' | 'member' | 'devops' | 'hr';
}

interface Message {
  id: string;
  content: string;
  sender: string;
  senderRole: 'admin' | 'member' | 'devops' | 'hr';
  timestamp: string;
  location: string;
  type: 'announcement' | 'message';
  reactions?: { [emoji: string]: string[] }; // emoji -> array of user IDs who reacted
}

const locations = [
  'All Locations',
  'Trivandrum',
  'Kochi', 
  'Bangalore'
];

export function ChatAnnouncements({ userRole }: ChatAnnouncementsProps) {
  // For demo purposes, simulating assigned location based on role
  // In a real app, this would come from user context/authentication
  const getUserAssignedLocation = () => {
    switch (userRole) {
      case 'hr': return 'Trivandrum';
      case 'devops': return 'Kochi';
      default: return 'All Locations';
    }
  };

  const userAssignedLocation = getUserAssignedLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome everyone to our new chat-based announcement system! 🎉',
      sender: 'Admin',
      senderRole: 'admin',
      timestamp: '2025-07-09T10:00:00Z',
      location: 'All Locations',
      type: 'announcement',
      reactions: { '👍': ['user1', 'user2'], '❤️': ['user3'] }
    },
    {
      id: '2',
      content: 'The Trivandrum office will have maintenance this weekend. Please plan accordingly. 🔧',
      sender: 'Admin',
      senderRole: 'admin',
      timestamp: '2025-07-09T10:15:00Z',
      location: 'Trivandrum',
      type: 'announcement',
      reactions: { '👍': ['user1'] }
    },
    {
      id: '3',
      content: 'New coffee machine installed in the Kochi office pantry! ☕',
      sender: 'Sarah Wilson',
      senderRole: 'devops',
      timestamp: '2025-07-09T11:30:00Z',
      location: 'Kochi',
      type: 'announcement',
      reactions: { '☕': ['user1', 'user2', 'user3'], '👍': ['user4'] }
    },
    {
      id: '4',
      content: 'Team meeting scheduled for Friday at 2 PM in the Bangalore office conference room.',
      sender: 'Mike Johnson',
      senderRole: 'devops',
      timestamp: '2025-07-09T12:00:00Z',
      location: 'Bangalore',
      type: 'announcement',
      reactions: {}
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [userLocation, setUserLocation] = useState('All Locations');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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

  const handleEmojiSelect = (emoji: string) => {
    if (['admin', 'hr', 'devops'].includes(userRole)) {
      setNewMessage(prev => prev + emoji);
    }
    setShowEmojiPicker(false);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const reactions = { ...message.reactions };
        const currentUserId = 'current-user'; // In real app, get from auth context
        
        if (!reactions[emoji]) {
          reactions[emoji] = [];
        }
        
        if (reactions[emoji].includes(currentUserId)) {
          // Remove reaction
          reactions[emoji] = reactions[emoji].filter(id => id !== currentUserId);
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
        } else {
          // Add reaction
          reactions[emoji].push(currentUserId);
        }
        
        return { ...message, reactions };
      }
      return message;
    }));
  };

  const filteredMessages = messages.filter(message => 
    userLocation === 'All Locations' || 
    message.location === 'All Locations' || 
    message.location === userLocation
  );

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
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
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
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.senderRole === 'admin' 
                    ? 'bg-primary text-primary-foreground ml-0' 
                    : 'bg-muted ml-auto'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Reactions */}
                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(message.reactions).map(([emoji, userIds]) => (
                        <Button
                          key={emoji}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs bg-background/10 hover:bg-background/20"
                          onClick={() => handleReaction(message.id, emoji)}
                        >
                          {emoji} {userIds.length}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Quick reaction buttons for members */}
                  {userRole === 'member' && (
                    <div className="flex gap-1 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-xs hover:bg-background/20"
                        onClick={() => handleReaction(message.id, '👍')}
                      >
                        👍
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-xs hover:bg-background/20"
                        onClick={() => handleReaction(message.id, '❤️')}
                      >
                        ❤️
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-xs hover:bg-background/20"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Member emoji reaction area */}
          {userRole === 'member' && showEmojiPicker && (
            <div className="border-t p-4 flex-shrink-0">
              <div className="relative">
                <EmojiPicker onEmojiSelect={(emoji) => {
                  // For members, emojis are used for reactions only
                  // You would typically associate this with a specific message
                  setShowEmojiPicker(false);
                }} />
              </div>
            </div>
          )}

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
                      // For HR and DevOps, only show their assigned location (disable "All Locations")
                      if (userRole === 'hr' || userRole === 'devops') {
                        if (location !== userAssignedLocation) {
                          return null;
                        }
                      }
                      
                      return (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      );
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
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2">
                        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                      </div>
                    )}
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
