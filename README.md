# Timeline

**AI-Powered News Tracking**

Timeline is a modern, responsive news aggregation platform that provides users with real-time global news stories and AI-generated audio briefings. Built with Next.js 15 and powered by MongoDB, it delivers a seamless experience for staying informed about world events.

## ✨ Features

### 📰 News Feed
- **Virtualized Infinite Scroll**: Efficient browsing through thousands of news articles
- **Real-time Updates**: Latest global news stories with automatic pagination
- **Source Attribution**: Multiple news sources for comprehensive coverage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🎧 Audio Briefings
- **AI-Generated Podcasts**: Listen to daily news summaries in audio format
- **Integrated Audio Player**: Full-featured HTML5 audio player with playback controls
- **Latest Content**: Always access the most recent audio briefing

### 🎨 User Experience
- **Dark/Light Mode**: System-aware theme with manual toggle
- **Modern UI**: Clean, minimalist design using Tailwind CSS
- **Fast Performance**: Optimized with React 19 and Next.js 15
- **Accessibility**: WCAG compliant with proper semantic markup

### 🔒 Security & Privacy
- **Content Security Policy**: Comprehensive CSP headers for XSS protection
- **Security Headers**: HSTS, X-Frame-Options, and other security measures
- **No Tracking**: Privacy-focused with minimal analytics

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Typography**: Geist Sans & Geist Mono fonts

### Backend
- **Runtime**: Node.js with TypeScript
- **Database**: MongoDB with optimized queries
- **API**: Next.js API routes with RESTful endpoints
- **Validation**: Zod for runtime type checking

### Development & Testing
- **Language**: TypeScript 5
- **Package Manager**: pnpm
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Linting**: ESLint with comprehensive rules
- **Formatting**: Prettier with Tailwind plugin
- **Build Tool**: Turbopack for fast development

### Deployment & Monitoring
- **Platform**: Vercel-optimized
- **Analytics**: Vercel Analytics (production only)
- **Performance**: Built-in Next.js optimizations

## 📁 Project Structure

```
timeline/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── feed/          # News feed API
│   │   ├── podcast/       # Audio briefing API
│   │   └── story/         # Individual story API
│   ├── story/[id]/        # Dynamic story pages
│   └── layout.tsx         # Root layout with metadata
├── components/            # React components
│   ├── feed/             # News feed components
│   │   ├── newsfeed.tsx  # Main feed page
│   │   ├── feed-list.tsx # Virtualized story list
│   │   └── news-briefing.tsx # Audio player
│   └── ui/               # Reusable UI components
├── lib/                   # Business logic
│   ├── services/         # Data access layer
│   │   ├── story-repository.ts
│   │   └── podcast-repository.ts
│   ├── clients/          # External service clients
│   └── api/              # Client-side API calls
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
├── hooks/                 # Custom React hooks
└── tests/                # Test suites
    ├── unit/             # Unit tests (Vitest)
    └── e2e/              # End-to-end tests (Playwright)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- pnpm (recommended) or npm/yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/florian-lup/timeline
   cd timeline
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   Create a `.env.local` file in the root directory:
   ```bash
   # MongoDB Configuration
   MONGODB_URI=example-mongodb-uri
   MONGODB_DB_NAME=example-db-name
   MONGODB_STORY_COLLECTION=example-story-collection
   MONGODB_PODCAST_COLLECTION=example-podcast-collection

   # Optional: Site URL for metadata
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
pnpm test:unit

# Watch mode for development
pnpm test:unit:watch

# Coverage report
pnpm test:coverage

# Interactive UI
pnpm test:unit:ui
```

### End-to-End Tests
```bash
# Run E2E tests
pnpm test:e2e

# Run specific browser
pnpm exec playwright test --project=chromium
```

### All Tests
```bash
pnpm test
```

## 🔧 Development

### Code Quality
```bash
# Lint check
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

### Build & Deploy
```bash
# Production build
pnpm build

# Start production server
pnpm start
```

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

**Timeline** - Stay informed, stay ahead. 🌍
