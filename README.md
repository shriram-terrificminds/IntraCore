# IntraCore - Office Management System

IntraCore is a comprehensive office management system designed to streamline operations across departments like DevOps, HR, and Admin. It provides features for inventory management, complaint handling, and internal communications.

## Features

- User Authentication with Role Management
- Inventory Request Management
- Complaint Tracking System
- Internal Broadcasts
- Team Configuration Management
- User Profile Management
- Comprehensive Reporting

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios for API communication

### Backend
- Laravel 10
- MySQL
- Redis
- JWT Authentication

### Infrastructure
- Docker

## Project Structure

```
IntraCore/
├── frontend/          # React + TypeScript frontend
├── backend/           # Laravel backend
```

## Prerequisites

- Docker and Docker Compose

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd IntraCore
   ```

2. Start Docker services:
   ```bash
   docker compose up --build
   ```

3. Install backend dependencies:
   ```bash
   docker compose exec backend composer install
   docker compose exec backend php artisan migrate
   ```

4. Access the application:
   - Frontend: http://localhost:8050
   - Backend API: http://localhost:8000

## Testing


## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

[License Type] - see LICENSE.md file for details 