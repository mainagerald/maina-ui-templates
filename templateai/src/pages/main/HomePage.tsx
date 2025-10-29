import { useState } from 'react';

// Import segmented components
import Hero from '@/components/layouts/home/Hero';
import Hatch from '@/components/layouts/home/Hatch';
import Events from '@/components/layouts/home/Events';
import CallToAction from '@/components/layouts/home/CallToAction';
import PartnersAndStats from '@/components/layouts/home/PartnersAndStats';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState('hero');

  // Handle section changes for smooth scrolling and transitions
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pt-0">
      <Hero
        />
      <Hatch
        />
      <Events
        />
      <PartnersAndStats
        />
      <CallToAction
        />
    </div>
  );
};

export default HomePage;
