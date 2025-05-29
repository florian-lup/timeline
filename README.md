# Timeline

AI-powered news tracker that captures and curates noteworthy events from around the globe in real time. Timeline combines web search, vector similarity search, and large-language models to stitch events into a continuously evolving narrative you can browse, search, and ask questions about.

## ✨ Features

- **Real-time event feed** – Paginated timeline backed by MongoDB.
- **Semantic search** – Ask natural-language questions that query a Pinecone vector index and get answers from GPT.
- **Web search fallback** – Optionally route the question through Tavily + GPT for up-to-the-minute answers.
- **Follow-up chat** – Conversational UI that keeps short-term chat history so you can dig deeper.
- **Dark/light theme** – Automatic theme switcher via `next-themes`.
- **Analytics** – Vercel Analytics & Speed Insights baked in.

## 🏗 Tech Stack

- [Next.js 15](https://nextjs.org/) App Router
- TypeScript, React 19
- Tailwind CSS 4 & [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- MongoDB Atlas – event storage
- Pinecone – vector similarity search
- OpenAI – embeddings & GPT completions
- Tavily Search API – fresh web context
- Vercel deployment (zero-config)

## 📂 Project Structure (high-level)

```
src/
 ├─ app/            # Next.js routes (app router)
 │   ├─ home/       # Landing page
 │   ├─ timeline/   # Timeline feed
 │   ├─ search/     # Semantic + web search UI
 │   └─ api/        # Serverless API routes (events, search, analytics)
 ├─ components/     # Shared, layout & UI components
 ├─ hooks/          # Client hooks (search, analytics, etc.)
 ├─ services/       # Server-side helpers (db, pinecone, tavily)
 ├─ lib/            # Utility functions (e.g. MongoDB connection)
 └─ types/          # TypeScript type definitions
```

## 🚀 Getting Started

### 1. Clone & Install

```bash
# clone
git clone https://github.com/your-user/timeline.git
cd timeline

# deps
npm install # or pnpm / yarn
```

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```bash
# .env.local
# MongoDB
MONGODB_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"

# OpenAI
OPENAI_API_KEY="sk-..."

# Pinecone
PINECONE_API_KEY="..."

# Tavily (optional – for web search)
TAVILY_API_KEY="..."
```

> ⚠️  Never commit `.env.local` to version control.

### 3. Development

```bash
npm run dev
# open http://localhost:3000
```

### 4. Production build

```bash
npm run build && npm start
```

## 🛠 Available Scripts

| Command          | Description                           |
|------------------|---------------------------------------|
| `npm run dev`    | Start Next.js in development mode      |
| `npm run build`  | Create an optimized production build   |
| `npm start`      | Run the production build locally       |
| `npm run lint`   | ESLint code quality check              |
| `npm run format` | Format files with Prettier             |

## 🔍 Architecture Highlights

1. **API Routes** – `/api/events` for paginated events, `/api/search/timeline` for vector search, `/api/search/web` for Tavily search, all written as Edge/Serverless functions.
2. **Vector Workflow**
   - User question → OpenAI `text-embedding-3-large` → Pinecone `events` index (namespace `research`).
   - Top-K results are provided to GPT along with the question + short chat history.
3. **Follow-up Chat** – Client keeps the last 10 Q/A pairs and sends them with each request so GPT can stay in context while keeping token usage low.
4. **Styling** – Tailwind CSS with `tailwind-merge` and `clsx` utilities to compose class names. Pre-built UI primitives come from shadcn/ui & Radix.

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push the branch: `git push origin feat/my-feature`
5. Open a Pull Request 🚀

## 📄 License

This project is Open Source under the MIT license.
