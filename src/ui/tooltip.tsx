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
    // Base positions with responsive spacing
    const basePositions = {
      top: 'bottom-full mb-1.5 sm:mb-2 md:mb-2.5',
      bottom: 'top-full mt-1.5 sm:mt-2 md:mt-2.5',
      left: 'right-full mr-1.5 sm:mr-2 md:mr-2.5',
      right: 'left-full ml-1.5 sm:ml-2 md:ml-2.5',
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
    // Responsive border sizes
    const borderSize = 'border-[3px] sm:border-[3.5px] md:border-4';

    if (position === 'top') {
      if (align === 'start') return `top-full left-3 ${borderSize} border-t-foreground border-l-transparent border-r-transparent border-b-transparent border-solid`;
      if (align === 'end') return `top-full right-3 ${borderSize} border-t-foreground border-l-transparent border-r-transparent border-b-transparent border-solid`;
      return `top-full left-1/2 -translate-x-1/2 ${borderSize} border-t-foreground border-l-transparent border-r-transparent border-b-transparent border-solid`;
    } else if (position === 'bottom') {
      if (align === 'start') return `bottom-full left-3 ${borderSize} border-b-foreground border-l-transparent border-r-transparent border-t-transparent border-solid`;
      if (align === 'end') return `bottom-full right-3 ${borderSize} border-b-foreground border-l-transparent border-r-transparent border-t-transparent border-solid`;
      return `bottom-full left-1/2 -translate-x-1/2 ${borderSize} border-b-foreground border-l-transparent border-r-transparent border-t-transparent border-solid`;
    } else if (position === 'left') {
      if (align === 'start') return `left-full top-3 ${borderSize} border-l-foreground border-t-transparent border-b-transparent border-r-transparent border-solid`;
      if (align === 'end') return `left-full bottom-3 ${borderSize} border-l-foreground border-t-transparent border-b-transparent border-r-transparent border-solid`;
      return `left-full top-1/2 -translate-y-1/2 ${borderSize} border-l-foreground border-t-transparent border-b-transparent border-r-transparent border-solid`;
    } else {
      if (align === 'start') return `right-full top-3 ${borderSize} border-r-foreground border-t-transparent border-b-transparent border-l-transparent border-solid`;
      if (align === 'end') return `right-full bottom-3 ${borderSize} border-r-foreground border-t-transparent border-b-transparent border-l-transparent border-solid`;
      return `right-full top-1/2 -translate-y-1/2 ${borderSize} border-r-foreground border-t-transparent border-b-transparent border-l-transparent border-solid`;
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
        <div className={`absolute z-10 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 text-xs sm:text-xs md:text-sm font-medium border border-foreground-secondary bg-[var(--background-secondary)] rounded opacity-95 whitespace-nowrap ${getPositionClasses()}`}>
          {content}
          <div className={`absolute ${getArrowClasses()}`}></div>
        </div>
      )}
    </div>
  );
} 