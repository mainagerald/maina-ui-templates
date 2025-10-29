
// Skeleton component for content loading
export const Skeleton: React.FC<{
    className?: string;
    variant?: 'rectangular' | 'circular' | 'text';
    height?: string;
    width?: string;
    animation?: 'pulse' | 'wave' | 'none';
  }> = ({ 
    className = '', 
    variant = 'rectangular',
    height,
    width,
    animation = 'pulse'
  }) => {
    const baseClass = 'bg-gray-200';
    const animationClass = animation === 'pulse' ? 'animate-pulse' : 
                           animation === 'wave' ? 'animate-shimmer' : '';
    
    const variantClass = 
      variant === 'circular' ? 'rounded-full' :
      variant === 'text' ? 'rounded h-4' :
      'rounded';
  
    const style = {
      height: height,
      width: width
    };
  
    return (
      <div 
        className={`${baseClass} ${variantClass} ${animationClass} ${className}`}
        style={style}
      />
    );
  }