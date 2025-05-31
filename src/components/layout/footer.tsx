import React, { memo } from 'react';

/**
 * Site footer with copyright information
 */
export const Footer = memo(function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto p-4 text-center text-xs md:text-sm lg:text-base">
      <p>© {currentYear} Timeline. All rights reserved.</p>
    </footer>
  );
});
