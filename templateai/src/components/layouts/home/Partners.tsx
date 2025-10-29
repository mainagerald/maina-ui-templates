import { useEffect, useState, useRef } from 'react';

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
  blabs];

interface PartnersProps {
  onSectionChange?: (section: string) => void;
}

const Partners = ({ onSectionChange }: PartnersProps) => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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
        <div 
          className={`text-center mb-12 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <h2 className="text-3xl font-bold">Partners</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Collaborating with leading organizations to advance AI innovation in Africa.
          </p>
        </div>
        
        <div 
          className={`flex flex-wrap justify-center gap-8 items-center max-w-6xl mx-auto transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ transitionDelay: '200ms' }}
        >
          {partners.map((partner, index) => (
            <div key={index} className="rounded-2xl w-32 h-32 flex items-center justify-center hover:shadow-sm transition-all duration-300 hover:-translate-y-1">
              <img src={partner} alt={`Partner ${index + 1}`} className="max-w-full max-h-full object-contain rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
