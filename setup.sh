#!/bin/bash

# Make the script executable
chmod +x setup.sh

# Function to print messages
print_message() {
    echo "===> $1"
}

# Stop any running containers
print_message "Stopping any running containers..."
docker compose down

# Build and start containers
print_message "Building and starting containers..."
docker compose up -d --build

# Wait for services to be ready
print_message "Waiting for services to be ready..."
sleep 10

# Install backend dependencies and set up database
print_message "Installing backend dependencies..."
docker compose exec backend composer install
docker compose exec backend php artisan config:clear
docker compose exec backend php artisan migrate:fresh --seed

# Install frontend dependencies
print_message "Installing frontend dependencies..."
docker compose exec frontend npm install

print_message "Setup complete! You can now access:"
print_message "Frontend: http://localhost:3000"
print_message "Backend API: http://localhost:8000"