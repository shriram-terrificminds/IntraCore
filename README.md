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
|── mobile/            # React native mobile
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
   docker compose exec backend php artisan migrate:fresh --seed # Optional - to reset tables once again
   ```

4. Access the application:
   - Frontend: http://localhost:8050
   - Backend: http://localhost:8000
   - API Documentation: http://localhost:8000/docs/api
   - Mailhog (Email Viewer): http://localhost:8025

## Testing

### Backend linting check

```shell
docker compose run --rm backend /bin/bash -c "vendor/bin/phpcs app config database routes tests && vendor/bin/phpmd app ansi rulesets.xml && vendor/bin/phpstan analyse app"
```

## Contributing

1. Create a feature OR bugfix branch from `development`
2. Commit your changes
3. Push to the branch
4. Create a Pull Request to `development`

## License

[License Type] - see LICENSE.md file for details 