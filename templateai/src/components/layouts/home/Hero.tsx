import { useEffect, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GradientBackground from "../../animations/GradientBackground";
import { useAuth } from "../../../auth/AuthContext";
import { showInfoToast } from "../toast/miniToast";
import Spinner from "../Spinner";

// Images in the public directory should be referenced directly with the path from the public root

interface HeroProps {
  onSectionChange?: (section: string) => void;
}

const JoinButton = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (isAuthenticated) {
      showInfoToast('You are already a member of our community!');
    } else {
      navigate('/register');
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className="text-2xl group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-medium bg-black backdrop-blur-sm hover:bg-black/90 text-white transition-all duration-300"
    >
      Join Us
      <ArrowRight className="w-7 h-7 transition-transform group-hover:translate-x-1 bg-white text-black rounded-full" />
    </button>
  );
};

const Hero = ({ onSectionChange }: HeroProps) => {
  const [visible, setVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const IMAGE_URL = "https://nairobiai-community-spotlight-images.s3.eu-north-1.amazonaws.com/nbo-sky.jpeg";

  useEffect(() => {
    // Preload the hero image
    const preloadImage = new Image();
    preloadImage.src = IMAGE_URL;
    
    // Add preconnect link
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://nairobiai-community-spotlight-images.s3.eu-north-1.amazonaws.com';
    document.head.appendChild(preconnectLink);
    
    // Add preload link
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = IMAGE_URL;
    document.head.appendChild(preloadLink);
    
    const timer = setTimeout(() => setVisible(true), 300);
    
    return () => {
      clearTimeout(timer);
      // Clean up the links when component unmounts
      document.head.removeChild(preconnectLink);
      document.head.removeChild(preloadLink);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* TEMPLATE background image with fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700" id="image-fallback"></div>
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-pink-700">
          <Spinner size="lg" color="white" text="Loading image..." />
        </div>
      )}
      <img
        src={IMAGE_URL}
        alt="TEMPLATE Skyline"
        className="absolute w-full h-full object-cover object-center"
        loading="eager"
        decoding="sync"
        data-priority="high"
        onLoad={() => setImageLoading(false)}
        onError={(e) => {
          // If image fails to load, show the fallback gradient
          setImageLoading(false);
          const target = e.currentTarget;
          target.style.display = 'none';
          document.getElementById('image-fallback')?.classList.add('animate-gradient-x');
        }}
      />
      {/* Darker overlay for more contrast and bolder text appearance */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

      <div className=" relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 pt-0 md:py-24">
        <div className="min-w-screen p-0 m-0">
          {/* Badge */}
          <div
            className={`transition-all duration-700 ease-out transform ${
              visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 sm:mb-4 sm:text-xs rounded-full text-sm font-medium bg-white/80 text-amber-600 border border-amber-300">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              East Africa's Premier AI Community
            </div>
          </div>

          {/* Headline & Description */}
          <div className="items-center justify-between gap-4 lg:grid-cols-2 md:grid md:grid-cols-2 sm:grid-cols-1">
            <section className="flex flex-col w-full bg-transparent">
              <h1
                className={`uppercase text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 sm:mb-3 transition-all duration-700 transform ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  EMPOWER
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  CO-CREATE
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-red-600">
                  TRANSFORM
                </span>
              </h1>
            </section>

            <section className="flex flex-col w-full bg-transparent items-end">
              <p
                className={`text font-normal md:text-md text-white max-w-md mb-10 leading-relaxed transition-all duration-700 transform ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                A swiftly expanding online community for AI enthusiasts.
                <br /> We are industry and background agnostic. 
                <br /> Our theme is AI accessibility, capacity-building events, lively
                forums, and push open-source projects tailored to our local
                challenges.{" "}
              </p>

              <div
                className={`flex flex-row gap-4 items-center transition-all duration-700 transform p-2 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: "800ms" }}
              >
                <JoinButton />
              </div>
            </section>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "1200ms" }}
          onClick={() => onSectionChange && onSectionChange("statistics")}
        >
          <div className="flex flex-col items-center cursor-pointer">
            <span className="text-sm text-gray-500 mb-2">Explore</span>
            <div className="w-6 h-10 border-2 border-gray-200 rounded-full flex justify-center p-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-scroll-down"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
