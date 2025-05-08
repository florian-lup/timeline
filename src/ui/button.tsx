import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'default',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-md cursor-pointer transition-colors';

  const variantClasses = {
    primary:
      'bg-foreground text-background border border-foreground/20 hover:bg-[var(--background-secondary)]',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'bg-transparent border border-foreground/20 text-foreground hover:bg-foreground/10',
  };

  const sizeClasses = {
    default: 'px-4 py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 text-sm md:text-base lg:text-lg',
    sm: 'px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5 text-xs md:text-sm lg:text-base',
    lg: 'px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 text-base md:text-lg lg:text-xl',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
