import { TrendingUpIcon, BarChart3Icon, UsersIcon, CalendarIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface StatisticsProps {
  onSectionChange?: (sectionId: string) => void;
}

const Statistics: React.FC<StatisticsProps> = ({ onSectionChange }) => {
  const stats = [
    { 
      value: '3000+', 
      label: 'Community Members', 
      icon: <UsersIcon className="text-blue-400" size={24} />,
      gradient: 'from-blue-400 to-blue-600'
    },
    { 
      value: '25+', 
      label: 'Upcoming Projects', 
      icon: <BarChart3Icon className="text-pink-400" size={24} />,
      gradient: 'from-pink-400 to-pink-600'
    },
    { 
      value: '20+', 
      label: 'Events Hosted', 
      icon: <CalendarIcon className="text-purple-400" size={24} />,
      gradient: 'from-purple-400 to-purple-600'
    },
  ];

  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!onSectionChange) return;
    const section = sectionRef.current;
    if (!section) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onSectionChange('statistics');
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
    };
  }, [onSectionChange]);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-400">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-semibold mb-16 text-white tracking-tight">
          <span className="">Raging Growth</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/15"
            >
              {/* Glossy gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-20 from-white/40 to-transparent pointer-events-none" />
              
              <div className="flex flex-col items-center justify-center p-10 min-h-[220px]">
                <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-full bg-gray-800/50 backdrop-blur-sm">
                  {stat.icon}
                </div>
                <div className="flex items-center mb-3">
                  <span className="text-6xl md:text-7xl font-bold text-white mr-2">{stat.value}</span>
                  <TrendingUpIcon className="inline-block text-green-400" size={28} />
                </div>
                <div className={`bg-gradient-to-r ${stat.gradient} mt-4 text-white text-base md:text-lg tracking-wide text-center font-medium rounded-full px-4 py-1 inline-block shadow-lg`}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;