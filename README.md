# Timeline

A real-time global events timeline application built with Next.js, MongoDB, and vector embeddings.

## Project Overview

This application aggregates major global events from the Perplexity API, processes them using vector embeddings (OpenAI), stores them in a vector database (Pinecone) for similarity checks, and maintains them in MongoDB for retrieval. A scheduled pipeline keeps events up-to-date.

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Databases**: MongoDB (events storage), Pinecone (vector embeddings)
- **APIs**: Perplexity AI, OpenAI (embeddings)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB Atlas account
- Pinecone account
- Perplexity API key
- OpenAI API key

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/events?retryWrites=true&w=majority

# API Keys
PERPLEXITY_API_KEY=your_perplexity_api_key
OPENAI_API=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=events

# Security
CRON_SECRET=your_secure_random_string_for_cron_auth
```

### Database Setup

#### MongoDB Atlas

1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster and database named "events"
3. Create collections:
   - `global` (for events data)
   - `views` (for analytics data)
4. Update your `.env.local` file with the connection string

#### Pinecone

1. Create an account on [Pinecone](https://www.pinecone.io/)
2. Create an index named "events" with dimension 1536 (for OpenAI embeddings)
3. Add your Pinecone API key to the `.env.local` file

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

```
src/
├── app/                   # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── analytics/     # Analytics endpoints
│   │   ├── events/        # Event pipeline endpoints
│   │   └── timeline/      # Timeline retrieval endpoints
│   └── ...                # Page components
├── components/            # Shared React components
├── features/              # Feature-based modules
│   ├── analytics/         # Analytics feature
│   ├── events/            # Events processing
│   │   ├── services/      # Event services
│   │   └── types/         # Event type definitions
│   └── timeline/          # Timeline display feature
├── lib/                   # Shared libraries
│   ├── config.ts          # Application configuration
│   └── mongodb.ts         # MongoDB connection
└── utils/                 # Utility functions
    ├── apiHelpers.ts      # API response utilities
    ├── authHelpers.ts     # Authentication utilities
    ├── mongoHelpers.ts    # MongoDB utilities
    └── textProcessing.ts  # Text processing utilities
```

### Key Features

1. **Event Pipeline**: Fetches, processes, and stores global events
2. **Timeline Display**: Shows events in chronological order
3. **Analytics**: Tracks timeline views and usage
4. **Vector Similarity**: Prevents duplicate events using embeddings

## API Documentation

### Events API

- `GET /api/events`: Triggers the event pipeline (requires CRON_SECRET)

### Timeline API

- `GET /api/timeline?page=1&limit=12`: Retrieves paginated timeline events

### Analytics API

- `GET /api/analytics/views`: Gets the current view count
- `POST /api/analytics/views`: Increments the view count

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
