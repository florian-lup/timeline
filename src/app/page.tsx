import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col px-4 py-8 md:px-8 lg:px-16">
      {/* Theme toggle in top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      {/* Hero section */}
      <main className="flex flex-col flex-grow items-start justify-center max-w-3xl mx-auto w-full mt-12 md:mt-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Your ideas deserve a better space.
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
          Organize your thoughts, projects, and life in one simple, 
          beautiful place. Just like Notion, but your way.
        </p>
        
        <div>
          <Link href="/thread">
            <button className="px-6 py-3 bg-foreground text-background border border-foreground/20 rounded-md font-medium hover:opacity-90 transition-opacity cursor-pointer">
              Get started
            </button>
          </Link>
        </div>
      </main>
      
      {/* Simple footer */}
      <footer className="mt-auto pt-8 pb-4 text-center text-sm text-muted-foreground">
        <p>© 2023 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
