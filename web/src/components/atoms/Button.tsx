import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

// Simple reusable button component with variants. Tailwind classes are
// conditionally applied based on the variant prop.
export default function Button({ children, variant = 'primary', ...rest }: ButtonProps) {
  const base = 'px-4 py-2 rounded focus:outline-none';
  const styles =
    variant === 'primary'
      ? `${base} bg-blue-600 text-white hover:bg-blue-700`
      : `${base} bg-gray-200 text-gray-800 hover:bg-gray-300`;
  return (
    <button className={styles} {...rest}>
      {children}
    </button>
  );
}