import { TrendingUpIcon, BarChart3Icon, UsersIcon, CalendarIcon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Import partner logos
import logo2 from "../../../assets/logos/logoipsum-359.svg";
import logo4 from "../../../assets/logos/logoipsum-290.svg";
import logo6 from "../../../assets/logos/logoipsum-223.svg";
import logo1 from "../../../assets/logos/logoipsum-365.svg"
import blabs from "../../../assets/logos/blabs.jpg";

const partners = [
  logo1, 
  logo2,
  logo4, 
  logo6,
  blabs
];

interface PartnersAndStatsProps {
  onSectionChange?: (sectionId: string) => void;
}

const PartnersAndStats: React.FC<PartnersAndStatsProps> = ({ onSectionChange }) => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const stats = [
    { 
      value: '3000+', 
      label: 'Community Members',
      description: 'A growing community of curious innovators, enthusiasts, and professionals.', 
      icon: <UsersIcon className="text-white" strokeWidth={1} size={32} />,
      gradient: 'from-blue-400 to-blue-600'
    },
    { 
      value: '25+', 
      label: 'Upcoming Projects', 
      description: 'A showcase of open-source projects and initiatives.', 
      icon: <BarChart3Icon className="text-white" strokeWidth={1} size={32} />,
      gradient: 'from-pink-400 to-pink-600'
    },
    { 
      value: '20+', 
      label: 'Events Hosted', 
      description: 'A horde of activities to keep the community engaged and inspired.', 
      icon: <CalendarIcon className="text-white" strokeWidth={1} size={32} />,
      gradient: 'from-purple-400 to-purple-600'
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (onSectionChange) {
            onSectionChange('partnersAndStats');
          }
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [onSectionChange]);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 bg-gradient-to-tr from-blue-700 via-purple-700 to-red-700 p-8 rounded-[2rem]">
        {/* Statistics Section */}
        <div className="mb-16 p-12">
          <h5 className="text-center text-3xl md:text-4xl font-semibold mb-6 text-white tracking-tight">
            <span className="">Raging Growth</span>
          </h5>
          <p className="text-center text-gray-100 max-w-3xl mx-auto mb-12 text-lg">
            We are experiencing raging growth with our community, building more projects, and hosting more events across Africa's tech ecosystem.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl backdrop-blur-sm bg-white/10 border border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/15"
              >
                {/* Glossy gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-20 from-white/40 to-transparent pointer-events-none" />
                
                <div className="flex flex-col h-full p-6">
                  {/* Header with icon and value */}
                  <div className="flex items-center mb-4">
                      {stat.icon}
                    <span className="ml-2 text-3xl md:text-4xl font-normal text-white">{stat.value}</span>
                  </div>
                  
                  {/* Label */}
                  <div className={`bg-gradient-to-r ${stat.gradient} text-white text-sm md:text-base tracking-wide text-center font-normal rounded-full px-4 py-1 inline-block shadow-lg mb-4 self-start`}>
                    {stat.label}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-100 text-sm md:text-base mt-2 flex-grow">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partners Section */}
        <div 
          className={`mt-16 mb-8 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Partners</h2>
            <p className="text-gray-100 mt-4 max-w-2xl mx-auto">
              We have partnered with industry leaders for opportunity creation, knowledge sharing, and accelerating AI innovation across Africa.
            </p>
          </div>
          
          <div 
            className={`flex flex-wrap justify-center gap-8 items-center max-w-6xl mx-auto transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            {partners.map((partner, index) => (
              <div key={index} className="rounded-2xl w-28 h-28 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <img src={partner} alt={`Partner ${index + 1}`} className="max-w-full max-h-full object-contain rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersAndStats;
