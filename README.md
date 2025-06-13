# Next.js Starter Template

A modern, production-ready Next.js starter template with TypeScript, Tailwind
CSS, and comprehensive tooling.

## ✨ Features

- **Next.js 15** with App Router and React 19
- **TypeScript** with strict type checking
- **Tailwind CSS v4** with Shadcn/UI components
- **Dark/Light mode** support
- **Playwright** E2E testing
- **ESLint + Prettier** code formatting
- **GitHub workflows** for automated CI/CD testing and linting
- **Security hardened** with strict CSP and headers

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
├── app/                # Next.js App Router
│   ├── api/            # API routes
│   └── ...             # Pages and layouts
├── components/
│   └── ui/             # Shadcn/UI components
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── public/             # Static assets
├── tests/              # Playwright tests
├── ...                 # Configuration files and folders
```

## 📝 License

MIT License - see [LICENSE](LICENSE) file.
