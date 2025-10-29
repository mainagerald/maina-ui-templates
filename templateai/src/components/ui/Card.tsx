import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`p-8 bg-gradient-to-br from-blue-900/30 to-black rounded-2xl border border-blue-900/20 shadow-2xl space-y-6 ${className || ''}`}>
    {children}
  </div>
);

export default Card;
