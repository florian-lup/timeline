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
    default: 'px-6 py-3',
    sm: 'px-4 py-2 text-sm',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}
