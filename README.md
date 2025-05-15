# Timeline

A real-time timeline application built with Next.js and MongoDB.

## Project Overview

This application stores and displays a paginated timeline of entries kept in MongoDB. An analytics endpoint tracks page-view counts so you can understand engagement over time.

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB Atlas account (or any reachable MongoDB instance)

### Environment Setup

Create a `.env.local` file in the root directory with the following variable:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/events?retryWrites=true&w=majority
```

### Database Setup

1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and spin up a free cluster
2. Create a database named `events`
3. Create the following collections:
   - `global`  (stores timeline entries)
   - `views`   (stores analytics data)
4. Update your `.env.local` file with the connection string

### Installation and Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Architecture

### Directory Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── analytics/   # Analytics endpoints
│   │   └── timeline/    # Timeline retrieval endpoints
│   └── ...              # Page components
├── components/          # Shared React components
├── features/
│   ├── analytics/       # Analytics feature
│   └── timeline/        # Timeline display feature
├── lib/
│   └── mongodb.ts       # MongoDB connection helper
└── utils/
    ├── apiHelpers.ts    # API response utilities
    ├── mongoHelpers.ts  # MongoDB utilities
    └── textProcessing.ts# Text processing utilities
```

### Key Features

1. **Timeline Display**: Shows entries in chronological order with pagination
2. **Analytics**: Tracks view counts for the timeline

## API Documentation

### Timeline API

- `GET /api/timeline?page=1&limit=12` – Retrieves paginated timeline entries

### Analytics API

- `GET /api/analytics/views` – Gets the current view count
- `POST /api/analytics/views` – Increments the view count

## Contributing

### Development Workflow

1. Fork and clone the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm test`
5. Push your branch: `git push origin feature/my-feature`
6. Open a Pull Request

### Code Style

- Follow the existing patterns and naming conventions
- Use TypeScript for type safety
- Keep components and functions small and focused
- Add JSDoc comments to exported functions

### Code Organization

- Place new features in the appropriate feature directory
- Add unit tests for new functionality
- Update documentation when adding new features
