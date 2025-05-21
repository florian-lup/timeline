'use client';

import { useState, useEffect } from 'react';

/**
 * Animated ellipsis effect for text
 */
export function TypewriterDots() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const sequence = ['', '.', '..', '...'];
    let index = 0;

    const interval = setInterval(() => {
      setDots(sequence[index]);
      index = (index + 1) % sequence.length;
    }, 375);

    return () => clearInterval(interval);
  }, []);

  return (
    <span style={{ display: 'inline-block', width: '1.5rem', textAlign: 'left' }}>{dots}</span>
  );
}
