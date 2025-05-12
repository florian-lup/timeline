# Events Pipeline

A script that automates major event searching and ingestion. The pipeline will:

1. Fetch multiple events from Perplexity API
2. Deduplicate similar content using Pinecone
3. Store and index unique results in MongoDB and Pinecone

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
# API Keys
PERPLEXITY_API_KEY=your_perplexity_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here

# Pinecone Configuration
PINECONE_INDEX_NAME=events

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string_here
```

3. Make sure you have:
   - A Perplexity API key (https://docs.perplexity.ai/guides/getting-started)
   - An OpenAI API key (https://platform.openai.com/)
   - A Pinecone account and API key (https://docs.pinecone.io/guides/get-started/quickstart)
   - A MongoDB database (can be local or Atlas)

## Usage

Run the pipeline with:

```bash
npm run events:pipeline
```

This will:

1. Search for major global events using Perplexity's Sonar API
2. Generate embeddings for each event using OpenAI's text-embedding-3-small model
3. Check for duplicates in Pinecone
4. Store unique events in MongoDB and index them in Pinecone

## Technical Details

- **Event Fetching**: Uses Perplexity API to search for major global events
- **Deduplication**: Uses OpenAI embeddings and Pinecone vector similarity search
- **Storage**: Stores events in MongoDB (database: events, collection: global)
- **Indexing**: Indexes events in Pinecone for future duplicate detection and semantic search

## Workflow

1. Events are fetched from Perplexity API with date and recency filters
2. Each event gets an embedding generated using OpenAI
3. Each embedding is checked against existing entries in Pinecone
4. If no similar event exists (similarity below threshold), the event is stored and indexed
5. If all events are duplicates, the circuit stops

## Troubleshooting

- If you see "Missing required environment variables" error, check your `.env` file
- If you see Pinecone errors, verify your API key and that your index exists
- If MongoDB connection fails, check your connection string
