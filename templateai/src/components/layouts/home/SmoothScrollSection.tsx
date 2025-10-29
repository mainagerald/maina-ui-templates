import React, { useEffect, useRef } from 'react';

interface SmoothScrollSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const SmoothScrollSection: React.FC<SmoothScrollSectionProps> = ({ id, children, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.style.transition = 'opacity 1.2s cubic-bezier(0.77,0,0.175,1), transform 1.2s cubic-bezier(0.77,0,0.175,1)';
    node.style.opacity = '0';
    node.style.transform = 'translateY(60px)';
    const onScroll = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
};

export default SmoothScrollSection;
