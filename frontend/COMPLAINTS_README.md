# Complaint Management System

A comprehensive complaint management system with role-based access control, image uploads, status tracking, and advanced filtering capabilities.

## Features

### 1. Complaint Form UI ✅

- **Title Input**: Required text input with validation
- **Role/Department Dropdown**: Select from Admin, HR, DevOps, Employee, Manager
- **Description**: Multiline textarea for detailed complaint information
- **Image Upload**: Optional multiple image upload (max 5 images, 5MB each)
- **Form Validation**: Real-time validation with error messages
- **Submit Button**: With loading state and success/error feedback

### 2. Complaint Card Display ✅

- **Status Badges**: Color-coded badges for Pending, In-progress, Resolved, Rejected
- **Image Previews**: Thumbnail previews with click-to-expand functionality
- **Resolution Notes**: Display resolution notes for resolved/rejected complaints
- **Complaint Details**: Reporter, department, dates, and resolution information
- **Role-based Actions**: Different buttons based on user role

### 3. Role-Based Status Update UI ✅

**Admin/HR/DevOps:**
- Can update status from Pending → In-progress
- Can update status from In-progress → Resolved/Rejected
- Can add resolution notes when updating status
- Full access to all complaint management features

**Employee:**
- Can create new complaints
- Can view all complaints
- Cannot update complaint statuses (read-only)

### 4. Filters & Search UI ✅

**Filter by:**
- Status (Pending, In-progress, Resolved, Rejected)
- Role/Department (Admin, HR, DevOps, Employee, Manager)

**Search by:**
- Complaint title
- Complaint number

**Sort by:**
- Latest first (default)
- Oldest first

## Components

### NewComplaintDialog
- Form with validation
- Image upload with preview
- Role selection dropdown
- Error handling and user feedback

### ComplaintCard
- Displays complaint information
- Image gallery with modal view
- Status update dialog for authorized users
- Resolution notes display

### ComplaintManagement
- Main dashboard component
- Statistics cards
- Advanced filtering and search
- Role-based access control
- Real-time filtering and sorting

## Usage

### Access the Demo
Navigate to `/complaints` to see the complaint management system in action.

### Role Switching
Use the role selector at the top to switch between different user roles and see how the interface changes:

- **Admin**: Full access to all features
- **HR**: Can update complaint statuses
- **DevOps**: Can update complaint statuses  
- **Employee**: Can only create and view complaints

### Creating a Complaint
1. Click "New Complaint" button
2. Fill in the required fields (Title, Role/Department, Description)
3. Optionally upload images (max 5)
4. Submit the form

### Updating Status (Admin/HR/DevOps)
1. Click "Update Status" on any complaint card
2. Select new status from dropdown
3. Add resolution notes if required
4. Submit the update

### Filtering and Searching
- Use the search bar to find complaints by title or number
- Use status filter to show specific statuses
- Use role filter to show complaints by department
- Use sort dropdown to change order

## Technical Implementation

### State Management
- Local state with React hooks
- Real-time filtering and search
- Optimistic updates for better UX

### Validation
- Form validation with error messages
- Image type and size validation
- Required field validation

### Responsive Design
- Mobile-friendly interface
- Responsive grid layouts
- Touch-friendly interactions

### Accessibility
- Proper ARIA labels
- Keyboard navigation
- Screen reader support

## Mock Data

The system includes sample complaints to demonstrate all features:
- Coffee machine issue (Pending)
- WiFi connectivity (In-progress)
- Air conditioning (Resolved)
- Printer paper jam (Rejected)
- Broken office chair (Pending)

Each complaint includes realistic data with images, resolution notes, and proper status progression.

## Future Enhancements

- Real API integration
- Email notifications
- File attachment support
- Advanced reporting
- Bulk operations
- Export functionality
- Real-time updates
- Mobile app integration 