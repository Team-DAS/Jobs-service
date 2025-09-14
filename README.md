# Jobs Service API

This is a NestJS-based microservice for managing job postings on the Freelancer Platform. It provides endpoints for creating, reading, updating, and deleting job postings, with authentication and authorization for employers.

## Features

- 🔍 **Public Job Search**: Search and filter active job postings
- 👔 **Employer Management**: Authenticated CRUD operations for job postings
- 🔐 **JWT Authentication**: Secure authentication using JWT tokens
- 📊 **Pagination**: Efficient pagination for large datasets
- 🏷️ **Filtering**: Filter by job type, experience level, and salary range
- 📚 **API Documentation**: Auto-generated Swagger documentation
- ✅ **Validation**: Request validation using class-validator
- 🗄️ **Database**: PostgreSQL with TypeORM

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```
docker compose down -v
docker compose build
docker compose up -d
docker ps
docker logs jobs-service-jobs-service-1


2. Set up your environment variables by creating a `.env` file:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=jobs_service

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application Configuration
PORT=3002
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

3. Create the PostgreSQL database:
```sql
CREATE DATABASE jobs_service;
```

4. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
- **Local**: http://localhost:3002/api/docs
- **Production**: https://api.freelanceudea.com/api/docs

## API Endpoints

### Public Endpoints

- `GET /v1/jobs` - List and filter all active jobs
- `GET /v1/jobs/{jobId}` - Get a single job by ID

### Protected Endpoints (Requires Authentication)

- `POST /v1/jobs` - Create a new job posting
- `PUT /v1/jobs/{jobId}` - Update an existing job
- `DELETE /v1/jobs/{jobId}` - Delete a job posting

## Authentication

The API uses JWT Bearer tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The JWT payload should contain:
- `sub`: User ID (employerId)
- `email`: User email
- `role`: User role (optional)

## Database Schema

The application uses a single `jobs` table with the following structure:

- `id` (UUID, Primary Key)
- `employer_id` (UUID, Foreign Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `responsibilities` (TEXT, Optional)
- `job_type` (ENUM: Full-time, Part-time, Contract, Internship)
- `experience_level` (ENUM: Entry-Level, Mid-Level, Senior-Level, Expert)
- `min_salary` (INTEGER, Optional)
- `max_salary` (INTEGER, Optional)
- `required_skills` (TEXT ARRAY, Optional)
- `status` (ENUM: Open, Closed, Draft)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── jwt.strategy.ts   # JWT strategy
│   ├── jwt-auth.guard.ts # JWT guard
│   └── auth.module.ts    # Auth module
├── common/               # Shared utilities
│   ├── dto/              # Common DTOs
│   ├── enums/            # Enums
│   └── filters/          # Exception filters
├── config/               # Configuration files
│   ├── database.config.ts
│   └── data-source.ts
├── jobs/                 # Jobs module
│   ├── dto/              # Data Transfer Objects
│   ├── entities/         # TypeORM entities
│   ├── jobs.controller.ts
│   ├── jobs.service.ts
│   └── jobs.module.ts
├── app.module.ts         # Root module
└── main.ts              # Application bootstrap
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_NAME` | Database name | `jobs_service` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `PORT` | Application port | `3002` |
| `NODE_ENV` | Environment | `development` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000` |

## License

This project is licensed under the UNLICENSED license. 