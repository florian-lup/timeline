import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ 
  content, 
  position = 'top',
  align = 'center',
  children,
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Alignment classes based on position and align props
  const getPositionClasses = () => {
    // Base positions
    const basePositions = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
      right: 'left-full ml-2',
    };
    
    // Horizontal alignment for top/bottom positions
    const horizontalAlign = {
      start: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      end: 'right-0',
    };
    
    // Vertical alignment for left/right positions
    const verticalAlign = {
      start: 'top-0',
      center: 'top-1/2 -translate-y-1/2',
      end: 'bottom-0',
    };
    
    // Combine base position with alignment
    if (position === 'top' || position === 'bottom') {
      return `${basePositions[position]} ${horizontalAlign[align]}`;
    } else {
      return `${basePositions[position]} ${verticalAlign[align]}`;
    }
  };

  // Arrow positioning based on alignment and position
  const getArrowClasses = () => {
    if (position === 'top') {
      if (align === 'start') return 'top-full left-3 border-t-foreground border-l-transparent border-r-transparent border-b-transparent border-solid border-4';
      if (align === 'end') return 'top-full right-3 border-t-foreground border-l-transparent border-r-transparent border-b-transparent border-solid border-4';
      return 'top-full left-1/2 -translate-x-1/2 border-t-foreground border-l-transparent border-r-transparent border-b-transparent border-solid border-4';
    } else if (position === 'bottom') {
      if (align === 'start') return 'bottom-full left-3 border-b-foreground border-l-transparent border-r-transparent border-t-transparent border-solid border-4';
      if (align === 'end') return 'bottom-full right-3 border-b-foreground border-l-transparent border-r-transparent border-t-transparent border-solid border-4';
      return 'bottom-full left-1/2 -translate-x-1/2 border-b-foreground border-l-transparent border-r-transparent border-t-transparent border-solid border-4';
    } else if (position === 'left') {
      if (align === 'start') return 'left-full top-3 border-l-foreground border-t-transparent border-b-transparent border-r-transparent border-solid border-4';
      if (align === 'end') return 'left-full bottom-3 border-l-foreground border-t-transparent border-b-transparent border-r-transparent border-solid border-4';
      return 'left-full top-1/2 -translate-y-1/2 border-l-foreground border-t-transparent border-b-transparent border-r-transparent border-solid border-4';
    } else {
      if (align === 'start') return 'right-full top-3 border-r-foreground border-t-transparent border-b-transparent border-l-transparent border-solid border-4';
      if (align === 'end') return 'right-full bottom-3 border-r-foreground border-t-transparent border-b-transparent border-l-transparent border-solid border-4';
      return 'right-full top-1/2 -translate-y-1/2 border-r-foreground border-t-transparent border-b-transparent border-l-transparent border-solid border-4';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-10 px-2 py-1 text-xs font-medium border border-foreground-secondary bg-[var(--background-secondary)] rounded opacity-95 whitespace-nowrap ${getPositionClasses()}`}>
          {content}
          <div className={`absolute ${getArrowClasses()}`}></div>
        </div>
      )}
    </div>
  );
} 