import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto pt-6 md:pt-8 lg:pt-10 pb-3 md:pb-4 lg:pb-5 text-center text-xs md:text-sm lg:text-base text-muted-foreground">
      <p>© {currentYear} Timeline. All rights reserved.</p>
    </footer>
  );
}
