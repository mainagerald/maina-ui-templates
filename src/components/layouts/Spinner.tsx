import React from 'react';
import { motion } from 'framer-motion';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  text?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  text
}) => {
  // Size mapping
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  // Color mapping
  const colorMap = {
    primary: 'border-primary',
    white: 'border-white',
    black: 'border-black',
    gray: 'border-gray-300'
  };

  const spinnerSize = sizeMap[size];
  const spinnerColor = colorMap[color as keyof typeof colorMap] || 'border-primary';

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`${spinnerSize} rounded-full border-t-transparent ${spinnerColor}`}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        role="status"
        aria-label="loading"
      />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default Spinner;
;
