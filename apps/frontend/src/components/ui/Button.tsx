import React from 'react';
import { cn } from '../../lib/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'dark' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'dark', size = 'md', fullWidth = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95',
          {
            'bg-gradient-to-r from-brand-orange to-brand-dark text-white shadow-sm hover:opacity-90':
              variant === 'gradient',
            'bg-brand-dark text-white hover:bg-neutral-800 shadow-sm': variant === 'dark',
            'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50': variant === 'outline',
            'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900': variant === 'ghost',
          },
          {
            'px-3 py-1.5 text-xs': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-6 py-3.5 text-base': size === 'lg',
          },
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
