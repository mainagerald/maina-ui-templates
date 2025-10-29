import { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CallToActionProps {
  onSectionChange?: (section: string) => void;
}

const CallToAction = ({ onSectionChange }: CallToActionProps) => {
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
      className="relative py-20 mt-0 mb-10 min-h-[80vh] overflow-hidden bg-white"
    >

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 
            className={`text-4xl md:text-5xl font-medium mb-6 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            Engage and Grow. <br/> Ready to Shape Africa's Future?
          </h2>
          
          <p 
            className={`text-xl text-gray-600 mb-10 transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: '200ms' }}
          >
            Join our community of curious innovators, researchers, developers, students, business professionals, enthusiasts, and ... everyone, 
            <br/>working together to build AI solutions that address Africa's unique challenges and opportunities.
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-700 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <Link
              to="/register"
              className="group relative overflow-hidden text-base px-10 py-5 rounded-full font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 hover:scale-110 transition-all ease-in-out duration-300">
                Join TEMPLATE
                {/* <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /> */}
              </span>
            </Link>
            
            {/* <Link
              to="/events"
              className="group relative overflow-hidden text-base px-10 py-5 rounded-full font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto text-center"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Upcoming Events
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
