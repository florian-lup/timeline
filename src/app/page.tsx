import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col ">
      <Header />

      {/* Hero section */}
      <main className="flex flex-col flex-grow items-start justify-center max-w-3xl mx-auto w-full mt-12 md:mt-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Your ideas deserve a better space.
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
          Organize your thoughts, projects, and life in one simple, beautiful place. Just like
          Notion, but your way.
        </p>

        <div>
          <Link href="/timeline">
            <Button>Get started</Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
