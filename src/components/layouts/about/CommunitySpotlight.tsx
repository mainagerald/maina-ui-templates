import { useEffect, useState, useRef } from 'react';
import { ArrowRight, ArrowUpRightFromSquare, Linkedin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CommunitySpotlightProps {
  onSectionChange?: (section: string) => void;
}

const CommunitySpotlight = ({ onSectionChange }: CommunitySpotlightProps) => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Members data with images from public folder
  const members = [
    {
      name: "David Wabongo",
      role: "Platform Engineer",
      imgSrc: "https://TEMPLATEai-community-spotlight-images.s3.eu-north-1.amazonaws.com/david.jpeg",
      linkedIn: "https://www.linkedin.com/in/david-wabongo-mbatani-bb9b45122/",
      website: "",
      fact: "Tapping into LLMs to build solutions that matter."
    },
    {
      name: "Maina Gerald",
      role: "Platform Engineer",
      imgSrc: "https://TEMPLATEai-community-spotlight-images.s3.eu-north-1.amazonaws.com/maina.jpeg",
      linkedIn: "https://www.linkedin.com/in/flavian-maina-gerald/",
      website: "",
      fact: "Transforming how we build and deploy AI applications, bit by bit."
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
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
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-transparent"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-medium font-sans mb-4 text-black">
            Community Spotlight
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the talented individuals driving AI innovation in TEMPLATE
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {members.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative bg-white overflow-hidden transition-all duration-300 flex flex-col h-[380px]">
                {/* Card top with image */}
                <div className="h-[250px] overflow-hidden relative rounded-2xl">
                  {/* Lazy loaded image */}
                  <img
                    src={member.imgSrc}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover object-center transition-transform duration-500 rounded-2xl"
                    loading="lazy"
                    onError={(e) => {
                      // If image fails to load, show a gradient with initials
                      const target = e.currentTarget as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        // Create initials from name
                        const initials = member.name.split(' ').map(n => n[0]).join('');
                        // Add initials element if it doesn't exist
                        if (!parent.querySelector('.member-initials')) {
                          const initialsEl = document.createElement('div');
                          initialsEl.className = 'member-initials absolute inset-0 flex items-center justify-center text-6xl font-bold text-indigo-600 bg-indigo-50';
                          initialsEl.textContent = initials;
                          parent.appendChild(initialsEl);
                        }
                      }
                    }}
                  />
                  
                  {/* Role badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-indigo-700 shadow-sm">
                    {member.role}
                  </div>
                </div>
                
                {/* Card content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-medium font-sans text-gray-800 mb-2 transition-colors">
                    {member.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-1 flex-grow">
                    {member.fact}
                  </p>
                  
                  {/* Social links */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div className="flex space-x-3">
                      
                      {member.website && (
                        <a 
                          href={member.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-400 hover:text-indigo-600 transition-colors"
                          aria-label={`${member.name}'s website`}
                        >
                          <Globe className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    
                    {member.linkedIn && (
                      <a 
                        href={member.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                      >
                        View LinkedIn Profile <ArrowUpRightFromSquare className="inline-block ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySpotlight;
