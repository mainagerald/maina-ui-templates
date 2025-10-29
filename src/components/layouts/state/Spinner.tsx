import React from 'react';
import { LoaderCircle } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClass = color === 'currentColor' ? '' : `text-${color}`;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoaderCircle
        className={`animate-spin ${colorClass} ${sizeMap[size]} text-black`}
        role="status"
        aria-label="loading"
      />
      {/* <span className="sr-only">Loading...</span> */}
    </div>
  );
};

export default Spinner;
