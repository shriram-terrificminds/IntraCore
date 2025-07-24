# Inventory Management Module

## Overview

The Inventory Management Module is a comprehensive system for managing office equipment and supply requests within the IntraCore application. It provides role-based access control, workflow management, and real-time status tracking for inventory requests.

## Features

### 🎯 Core Functionality
- **Request Creation**: Users can create new inventory requests with title, department, and description
- **Status Workflow**: Complete lifecycle management from pending to received
- **Role-Based Access**: Different permissions and views based on user roles
- **Real-time Updates**: Status changes with approval/delivery tracking
- **Search & Filtering**: Advanced filtering by status, department, and request type
- **Audit Trail**: Complete tracking of who approved and delivered requests

### 🔐 Role-Based Permissions

#### **Admin Role**
- **View**: All requests across all departments
- **Actions**: 
  - Approve/Reject pending requests
  - Mark approved requests as delivered
  - Update delivered status (Mark Received/Back to Pending)
- **Filters**: Status, Department

#### **HR Role**
- **View**: Requests made to HR department + own requests
- **Actions**:
  - Approve/Reject HR department requests
  - Mark approved HR requests as delivered
  - Update delivered HR requests status
  - Mark own delivered requests as received
- **Filters**: Status, Department, Request Type (All/My Requests/Requests to Handle)

#### **DevOps Role**
- **View**: Requests made to DevOps department + own requests
- **Actions**:
  - Approve/Reject DevOps department requests
  - Mark approved DevOps requests as delivered
  - Update delivered DevOps requests status
  - Mark own delivered requests as received
- **Filters**: Status, Department, Request Type (All/My Requests/Requests to Handle)

#### **Employee Role**
- **View**: Only own requests
- **Actions**:
  - Create new requests
  - Mark own delivered requests as received
- **Filters**: Status, Department

## 📋 Request Workflow

```
Pending → Approved → Delivered → Received
   ↓         ↓         ↓
[Approve] [Deliver] [Mark Received]
[Reject]  [Back to Pending]
```

### Status Definitions
- **Pending**: New request awaiting approval
- **Approved**: Request approved by department manager
- **Delivered**: Item has been delivered to requester
- **Received**: Requester has confirmed receipt
- **Rejected**: Request denied by department manager

## 🏗️ Technical Implementation

### Components

#### `InventoryRequests.tsx`
Main component handling the inventory request management interface.

**Key Features:**
- Role-based request filtering
- Status workflow management
- Action button rendering based on user role and request status
- Search and filtering functionality
- Approval/delivery tracking display

**State Management:**
```typescript
const [showNewRequest, setShowNewRequest] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
const [departmentFilter, setDepartmentFilter] = useState('all');
const [requestTypeFilter, setRequestTypeFilter] = useState<'all' | 'my-requests' | 'to-handle'>('all');
const [requests, setRequests] = useState<InventoryRequest[]>(mockRequests);
```

**Data Structure:**
```typescript
interface InventoryRequest {
  id: number;
  title: string;
  department: string;
  description: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'delivered' | 'received' | 'rejected';
  requestDate: string;
  requestNumber: string;
  approvedBy?: string;
  deliveredBy?: string;
  approvedAt?: string;
  deliveredAt?: string;
}
```

#### `NewRequestDialog.tsx`
Dialog component for creating new inventory requests.

**Features:**
- Form validation
- Department selection
- Title and description input
- Toast notifications for feedback

### Key Functions

#### `renderActionButtons(request: InventoryRequest)`
Renders appropriate action buttons based on:
- User role (admin/hr/devops/employee)
- Request status (pending/approved/delivered)
- Request department vs user role
- Whether user is the requester

#### `handleStatusUpdate(requestId: number, newStatus: string)`
Updates request status and tracks approval/delivery information:
- Updates request status
- Records who approved/delivered
- Records timestamp
- Shows toast notification

#### `filteredRequests`
Applies multiple filters:
- Role-based visibility
- Request type filtering (for HR/DevOps)
- Search query matching
- Status filtering
- Department filtering

## 🎨 UI Components

### Status Badges
- **Pending**: Yellow with clock icon
- **Approved**: Blue with checkmark icon
- **Delivered**: Green with truck icon
- **Received**: Emerald with check-square icon
- **Rejected**: Red with X icon

### Action Buttons
- **Approve**: Green outline button with checkmark
- **Reject**: Red destructive button with X
- **Mark Delivered**: Blue button with truck icon
- **Mark Received**: Green button with check-square icon

### Filter Dropdowns
- **Status Filter**: All statuses, pending, approved, delivered, received, rejected
- **Department Filter**: All departments, HR, DevOps, Admin, Engineering, etc.
- **Request Type Filter** (HR/DevOps only): All requests, My requests, Requests to handle

## 🔄 Request Type Filtering

### For HR and DevOps Roles

#### "All Requests"
Shows both:
- Requests they created (My Requests)
- Requests made to their department (Requests to Handle)

#### "My Requests"
Shows only requests where:
- `request.requestedBy === currentUser`

#### "Requests to Handle"
Shows only requests where:
- `request.department === userRole` (HR or DevOps)
- `request.requestedBy !== currentUser` (not their own requests)

## 📊 Mock Data

The module includes comprehensive mock data with various scenarios:
- Pending requests for different departments
- Approved requests with approval tracking
- Delivered requests with delivery tracking
- Received requests with complete audit trail
- Rejected requests

## 🚀 Usage Examples

### Creating a New Request
1. Click "New Request" button
2. Fill in title, select department, add description
3. Submit form
4. Request appears in pending status

### Approving a Request (HR/DevOps/Admin)
1. View pending requests for your department
2. Click "Approve" or "Reject" button
3. Status updates with approval tracking

### Marking as Delivered
1. View approved requests
2. Click "Mark Delivered" button
3. Status updates with delivery tracking

### Marking as Received (Requester)
1. View delivered requests you created
2. Click "Mark as Received" button
3. Request completes workflow

## 🔧 Future Enhancements

### Potential Improvements
- **Email Notifications**: Notify users of status changes
- **File Attachments**: Allow attaching images/documents to requests
- **Priority Levels**: Add high/medium/low priority system
- **Bulk Actions**: Approve/reject multiple requests at once
- **Export Functionality**: Export requests to CSV/PDF
- **Dashboard Analytics**: Charts and metrics for request trends
- **Integration**: Connect with actual inventory management systems

### Backend Integration
- Replace mock data with API calls
- Add database persistence
- Implement real-time updates
- Add user authentication and authorization
- Include audit logging

## 📝 Notes

- Currently uses mock data for demonstration
- All state is managed locally with React hooks
- Toast notifications provide user feedback
- Responsive design works on mobile and desktop
- TypeScript provides type safety throughout
- Role-based filtering ensures proper access control

## 🐛 Known Issues

- Mock data resets on page refresh
- No persistence between sessions
- Limited to frontend-only implementation
- No real-time collaboration features

---

*This module provides a solid foundation for inventory request management with comprehensive role-based access control and workflow management.* 