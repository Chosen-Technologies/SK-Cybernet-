import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-brand-blue-deep text-brand-white hover:bg-opacity-90 focus:ring-brand-blue-accent',
    secondary: 'bg-brand-blue-accent text-brand-white hover:bg-opacity-90 focus:ring-brand-blue-light',
    outline: 'border border-brand-blue-deep text-brand-blue-deep hover:bg-brand-gray-light focus:ring-brand-blue-deep',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-brand-white border border-brand-gray-border rounded-xl p-6 ${
        hoverable ? 'hover:shadow-md transition-shadow duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-brand-blue-deep">
          {label}
        </label>
      )}
      <input
        className={`px-3 py-2 border rounded-lg bg-brand-white text-brand-blue-deep placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-blue-accent transition-all ${
          error ? 'border-red-500 focus:ring-red-500' : 'border-brand-gray-border focus:border-brand-blue-accent'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
