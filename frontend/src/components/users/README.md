# User Management Module

## Overview
The User Management module has been completely updated to provide a comprehensive user administration system with the following features:

## Features

### 1. Create User Form
- **Fields:**
  - First Name (required)
  - Last Name (required)
  - Email (required)
  - Role (Dropdown: Admin, HR, DevOps, Employee)
  - Location (Dropdown: TVM, Ernakulam, Bangalore)
  - Profile Image Upload

- **Actions:**
  - Submit → Creates user with temporary password
  - Backend sends welcome email with login credentials
  - Shows toast notification for success/error

### 2. Edit User
- Opens existing user details in an editable form
- **Editable Fields:**
  - First Name, Last Name
  - Email
  - Role (Admin, HR, DevOps, Employee)
  - Location (TVM, Ernakulam, Bangalore)
  - Profile Image
  - Password (optional)

- **Actions:**
  - Save button → Updates data in database
  - Shows toast feedback for update success/failure

### 3. Delete User
- Delete button next to each user in the list
- Confirmation dialog before deletion
- On confirm, removes user from database
- Logs action for audit (backend implementation)

### 4. View, Filter & Search
- **User Table with:**
  - Name (First + Last)
  - Email
  - Role
  - Location
  - Joined Date
  - Last Edited Info

- **Filters:**
  - Role Dropdown (All, Admin, HR, DevOps, Employee)
  - Location Dropdown (All, TVM, Ernakulam, Bangalore)

- **Search:**
  - Search by name or email
  - Real-time filtering

## Technical Implementation

### Frontend Changes
1. **Updated User Interface:**
   - Changed from `name` to `firstName` and `lastName`
   - Updated role system to use numeric IDs (1=Admin, 2=HR, 3=DevOps, 4=Employee)
   - Updated locations to TVM, Ernakulam, Bangalore
   - Removed status and department fields

2. **API Integration:**
   - Created `apiService` for backend communication
   - Real-time data loading from backend
   - Proper error handling with toast notifications

3. **Components Updated:**
   - `UserManagement.tsx` - Main component with filtering and search
   - `CreateUserDialog.tsx` - User creation form with image upload
   - `EditUserDialog.tsx` - User editing form
   - `DeleteUserDialog.tsx` - Confirmation dialog

### Backend Changes
1. **Database Migrations:**
   - Updated users table structure (firstName, lastName)
   - Updated locations data (TVM, Ernakulam, Bangalore)
   - Updated roles order (Admin, HR, DevOps, Employee)

2. **Models Updated:**
   - `User.php` - Updated fillable fields and added full name accessor
   - `Role.php` - Maintains existing structure
   - `Location.php` - Maintains existing structure

3. **Controllers:**
   - `AuthController.php` - Updated for new user structure
   - `UserController.php` - New controller for user management operations

4. **API Routes:**
   - Added user management endpoints
   - Protected routes with authentication

## Role System
- **1 = Admin** - Full system access
- **2 = HR** - HR management access
- **3 = DevOps** - Technical operations access
- **4 = Employee** - Basic user access

## Location System
- **TVM** - Trivandrum office
- **Ernakulam** - Ernakulam office
- **Bangalore** - Bangalore office

## API Endpoints
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/{id}` - Get specific user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `GET /api/roles` - Get all roles
- `GET /api/locations` - Get all locations

## Usage
1. **Creating Users:** Click "Create User" button, fill form, submit
2. **Editing Users:** Click edit icon next to user, modify fields, save
3. **Deleting Users:** Click delete icon, confirm in dialog
4. **Filtering:** Use role and location dropdowns
5. **Searching:** Type in search box to filter by name or email

## Security Features
- Authentication required for all operations
- Password hashing for security
- Temporary password generation for new users
- Audit logging for user deletions
- Input validation on both frontend and backend 