# Next.js Starter Template

A modern, production-ready Next.js starter template with TypeScript, Tailwind CSS, and comprehensive tooling.

## ✨ Features

- **Next.js 15** with App Router and React 19
- **TypeScript** with strict type checking
- **Tailwind CSS v4** with Shadcn/UI components
- **Dark/Light mode** support
- **Playwright** E2E testing
- **ESLint + Prettier** code formatting
- **SEO optimized** with metadata and Open Graph support
- **Security hardened** with strict CSP and security headers

## 📏 Code Quality Standards

Comprehensive ESLint rules with TypeScript strict mode, SonarJS integration, absolute imports (`@/` prefix), kebab-case filenames, import ordering, complexity limits, and naming conventions. Configured in `eslint.config.mjs`.

## 🚀 Quick Start

```bash
# Clone the template
git clone https://github.com/florian-lup/nextjs-template
cd nextjs-template

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts

| Command       | Description               |
| ------------- | ------------------------- |
| `pnpm dev`    | Start development server  |
| `pnpm build`  | Build for production      |
| `pnpm start`  | Start production server   |
| `pnpm lint`   | Run ESLint                |
| `pnpm format` | Format code with Prettier |
| `pnpm test`   | Run Playwright tests      |

## 📁 Project Structure

```
nextjs-template/
├── app/                 # Next.js App Router
│   ├── actions/        # Server actions
│   ├── api/            # API routes
│   └── ...             # Pages and layouts
├── components/
│   └── ui/             # Shadcn/UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── public/             # Static assets
└── tests/              # Playwright tests
```

## 🎨 Adding Components

Add Shadcn/UI components:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file.
