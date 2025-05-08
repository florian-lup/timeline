import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto pt-8 pb-4 text-center text-sm text-muted-foreground">
      <p>© {currentYear} Timeline. All rights reserved.</p>
    </footer>
  );
}
