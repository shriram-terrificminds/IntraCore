
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Send, MapPin, Smile, Calendar } from 'lucide-react';
import { EmojiPicker } from './EmojiPicker';

const locations = [
  'All Locations',
  'New York Office',
  'London Office',
  'California Office',
  'Singapore Office',
  'Toronto Office'
];

export function ChatAnnouncements({ userRole }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: 'Welcome everyone to our new chat-based announcement system! 🎉',
      sender: 'Admin',
      senderRole: 'admin',
      timestamp: '2025-07-09T10:00:00Z',
      location: 'All Locations',
      type: 'announcement'
    },
    {
      id: '2',
      content: 'The New York office will have maintenance this weekend. Please plan accordingly. 🔧',
      sender: 'Admin',
      senderRole: 'admin',
      timestamp: '2025-07-09T10:15:00Z',
      location: 'New York Office',
      type: 'announcement'
    },
    {
      id: '3',
      content: 'New coffee machine installed in the London office pantry! ☕',
      sender: 'Sarah Wilson',
      senderRole: 'admin',
      timestamp: '2025-07-09T11:30:00Z',
      location: 'London Office',
      type: 'announcement'
    },
    {
      id: '4',
      content: 'Team meeting scheduled for Friday at 2 PM in the California office conference room.',
      sender: 'Admin',
      senderRole: 'admin',
      timestamp: '2025-07-09T12:00:00Z',
      location: 'California Office',
      type: 'announcement'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [userLocation, setUserLocation] = useState('All Locations');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || userRole !== 'admin') return;

    const message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'Admin',
      senderRole: 'admin',
      timestamp: new Date().toISOString(),
      location: selectedLocation,
      type: 'announcement'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const filteredMessages = messages.filter(message => 
    userLocation === 'All Locations' || 
    message.location === 'All Locations' || 
    message.location === userLocation
  );

  const formatTimestamp = (timestamp) => {
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
          <h2 className="text-2xl font-bold mb-2">Team Chat</h2>
          <p className="text-muted-foreground">
            Real-time announcements and updates
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
                      className="text-xs"
                    >
                      {message.sender}
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
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Only for Admins */}
          {userRole === 'admin' && (
            <div className="border-t p-4 flex-shrink-0">
              <div className="flex flex-col gap-3">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select target location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
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
