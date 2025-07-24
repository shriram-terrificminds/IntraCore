# Chat-Style Announcements System

## Overview
A real-time chat-style announcements system with role-based access control and location-specific messaging.

## Features

### 1. Chat-Style UI Layout
- **Top Bar**: Title "Announcements" with location selector dropdown
- **Chat Area**: Displays all past messages with sender info, timestamps, and reactions
- **Message Input**: Bottom section for composing new announcements (role-dependent)

### 2. Role-Based Access Control

#### Admin
- Can send announcements to any location (All Locations, Bangalore, Trivandrum, Kochi)
- Full access to all features
- Can view and manage all messages

#### HR
- Can send to any location (All Locations, Bangalore, Trivandrum, Kochi)
- Can view messages from any location
- Initial view starts with their working location
- Location dropdown shows all locations

#### DevOps
- Can only send to their working location
- Can only view messages from their working location and "All Locations"
- Location dropdown shows only their working location and "All Locations"

#### Employee/Member
- Read-only access to announcements
- Can switch between "All Messages" and "Working Location Only"
- "All Messages": See messages from all locations (including HR/Admin messages to all locations)
- "Working Location Only": See only their working location + "All Locations" messages
- Can react to messages with emojis
- No input section visible
- Location dropdown with two options

### 3. Message Features
- **Sender Information**: Name and role displayed
- **Location Tags**: Shows target location for each message
- **Timestamps**: Relative time display (e.g., "2h ago", "Just now")
- **Emoji Reactions**: Users can react to messages with emojis
- **Message Filtering**: Users see messages relevant to their location

### 4. Notification System
- On message send, triggers notifications to users in the selected location
- Email and in-app push notifications (TODO: implement backend integration)
- Console logging for development purposes

## Location Configuration
The system supports the following locations:
- All Locations
- Bangalore
- Trivandrum
- Kochi

### Working Location Assignment
Each user's working location is configurable:
- **HR**: Can work in any location (Trivandrum, Kochi, Bangalore)
- **DevOps**: Assigned to specific working location (Trivandrum, Kochi, or Bangalore)
- **Employee**: Assigned to specific working location (Trivandrum, Kochi, or Bangalore)

*Demo Configuration:*
- **HR**: Trivandrum
- **DevOps**: Kochi  
- **Employee**: Kochi

*Note: In the current demo, locations are hardcoded. In production, these should come from user profiles/database.*

## Usage

### For Admins/HR/DevOps
1. Select target location from dropdown (restricted based on role)
2. Type announcement in the input field
3. Add emojis using the emoji picker if desired
4. Click send or press Enter to publish

### For Employees
1. View announcements in the chat area
2. Filter by location using the top dropdown
3. React to messages using emoji buttons
4. Use the emoji picker for custom reactions

## Technical Implementation

### Components
- `ChatAnnouncements.tsx` - Main chat interface
- `EmojiPicker.tsx` - Emoji selection component
- `Announcements.tsx` - Wrapper component

### Key Functions
- `handleSendMessage()` - Processes new message creation
- `handleReaction()` - Manages emoji reactions
- `getUserAssignedLocation()` - Determines user's assigned location
- `formatTimestamp()` - Formats message timestamps

### State Management
- Messages array with reactions
- Current user location filter
- Selected target location for sending
- Emoji picker visibility state

## Integration Points for Backend

### Current Hardcoded Values (To be replaced):
1. **User Roles & Locations**: Currently hardcoded in `getUserAssignedLocation()`
2. **Demo Messages**: Currently hardcoded in initial state
3. **User Authentication**: Currently simulated with props
4. **Notifications**: Currently console.log (needs backend integration)

### Backend Integration Requirements:
1. **User Context**: Replace hardcoded roles with authenticated user data
2. **Message Storage**: Replace demo messages with database queries
3. **Real-time Updates**: Implement WebSocket connections
4. **Notification System**: Integrate with email/push notification services
5. **Location Management**: Dynamic location assignment from user profiles

## Future Enhancements
- Real-time WebSocket integration
- Backend notification system
- Message editing and deletion
- File attachments
- Message threading
- Advanced filtering and search 