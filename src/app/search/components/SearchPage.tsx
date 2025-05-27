'use client';

import { useState } from 'react';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SearchInput } from './SearchInput';
import { EventCarousel } from './EventCarousel';
import { PageViewTracker } from '@/components/PageViewTracker';


/**
 * Search page that provides an input for querying events and shows recent events.
 */
export function SearchPage() {
  const [query, setQuery] = useState('');

  // Placeholder submit handler
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: integrate search results handling
    console.log('Searching for:', query);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PageViewTracker />
      <Header />

      <main className="flex flex-col flex-grow w-full p-4 md:p-6 lg:p-8 items-center justify-center gap-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center">Search Events</h1>
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} />
        </form>

        {/* Recent events carousel */}
        <section className="w-full">
          <EventCarousel />
        </section>
      </main>

      <Footer />
    </div>
  );
}
