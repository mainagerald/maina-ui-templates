import React from 'react';

interface GradientBackgroundProps {
  colors?: string[];
  duration?: number;
  className?: string;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors = ['#e8fae8', '#e1f1fa', '#f3d5f5'],  // Default blue to purple to pink
  duration = 1,
  className = ''
}) => {
  const colorString = colors.join(', ');
  
  return (
    <div 
      className={`absolute inset-0 ${className}`}
      style={{
        background: `linear-gradient(90deg, ${colorString})`,
        backgroundSize: '300% 300%',
        animation: `gradient ${duration}s alternate infinite ease-in-out`
      }}
    />
  );
};

export default GradientBackground;
