// React is automatically imported by JSX transform
import { useState, useEffect } from 'react';
import CommunitySpotlight from '@/components/layouts/about/CommunitySpotlight';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Globe, Award, ChevronRight } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center overflow-x-hidden">
      {/* Modern Hero Section */}
      <section className="relative w-full py-20 md:py-28 flex items-center justify-center overflow-hidden mb-2 bg-white">
        
        
        <div className="relative z-10 text-center px-4 py-8 md:py-0 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-600/70 via-purple-400/70 to-red-400/70 text-white rounded-full text-sm font-medium">
              About TEMPLATE
            </span>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10"
          >
            Empowering Africa's AI Community to Innovate, Connect, and Lead the Future.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <Link to="/events" className="inline-flex items-center px-6 py-3 rounded-2xl bg-black/70 text-white font-medium hover:bg-indigo-700 transition-colors">
              See Our Events <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            <Link to="/register" className="inline-flex items-center px-6 py-3 rounded-2xl bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Join Our Community <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Origins - Timeline Section */}
      <section className="w-full max-w-6xl mb-16 md:mb-24 py-12 md:py-16 bg-white mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-normal mb-4 text-black">Our Journey</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">From small beginnings to a thriving community of innovators</p>
        </motion.div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-red-600 rounded-full"></div>
          
          {/* Timeline items */}
          <div className="grid grid-cols-1 gap-12 md:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center"
            >
              <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                <div className="bg-blue-600 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-indigo-50">
                  <h3 className="text-xl font-normal mb-2 text-gray-100">Commencement</h3>
                  <p className="text-gray-200">
                    TEMPLATE was born from a shared vision: to create a vibrant hub where curiosity, collaboration, and technology converge. What started as a small gathering of just 7 AI enthusiasts has grown into a dynamic movement.
                  </p>
                  <div className="mt-4 flex items-center md:justify-end">
                    {/* <div className="h-1 w-12 bg-indigo-600 mr-3"></div> */}
                    <span className="text-sm font-bold text-gray-300">2022</span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center z-10 bg-indigo-600 rounded-full w-12 h-12 shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center"
            >
              <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
              <div className="relative flex items-center justify-center z-10 bg-purple-600 rounded-full w-12 h-12 shadow-md">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="md:w-1/2 md:pl-12 mb-6 md:mb-0">
                <div className="bg-purple-600 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-purple-50">
                  <h3 className="text-xl font-normal text-white mb-2">Growing Community</h3>
                  <p className="text-gray-200">
                    We've expanded to a thriving community of over 500 AI enthusiasts, uniting students, professionals, and innovators across TEMPLATE and beyond. Our journey reflects TEMPLATE's emergence as a tech powerhouse in Africa.
                  </p>
                  <div className="mt-4 flex items-center">
                    {/* <div className="h-1 w-12 bg-purple-600 mr-3"></div> */}
                    <span className="text-sm font-bold text-gray-300">2023</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center"
            >
              <div className="md:w-1/2 md:pr-12 md:text-right mb-6 md:mb-0">
                <div className="bg-red-600 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-indigo-50">
                  <h3 className="text-xl font-normal text-white mb-2">Looking Forward</h3>
                  <p className="text-gray-200">
                    Today, we're focused on building capacity, fostering innovation, and establishing TEMPLATE as Africa's AI capital—a place where bold ideas take shape and technology creates a brighter, more inclusive future.
                  </p>
                  <div className="mt-4 flex items-center md:justify-end">
                    {/* <div className="h-1 w-12 bg-indigo-600 mr-3"></div> */}
                    <span className="text-sm font-bold text-gray-300">Present</span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center z-10 bg-red-600 rounded-full w-12 h-12 shadow-md">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Goals & Aspirations */}
      <section className="w-full max-w-6xl mb-16 md:mb-24 py-12 md:py-16 bg-white mx-auto px-4 sm:px-8 rounded-2xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-medium mb-4 text-black">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Empowering Africa's AI ecosystem through community, education, and innovation</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              <h3 className="ml-2 text-xl font-normal text-gray-800">Foster Community</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We build a supportive network for AI learning and growth, creating spaces where knowledge flows freely and collaboration thrives. Our community connects beginners with experts, fostering mentorship and shared growth.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
                <Lightbulb className="w-6 h-6 text-indigo-600" />
              <h3 className="ml-2 text-xl font-normal text-gray-800">Drive Innovation</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We encourage real-world projects and creative problem-solving that address local challenges with global technologies. Through hackathons, workshops, and collaborative projects, we turn ideas into impactful solutions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-pink-600" />
              <h3 className="ml-2 text-xl font-normal text-gray-800">Promote Inclusion</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We make AI accessible to all, regardless of background or experience, ensuring diverse voices shape our technological future. Our programs specifically target underrepresented groups to create a more equitable AI landscape.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
                <Award className="w-6 h-6 text-blue-600" />
              <h3 className="ml-2 text-xl font-normal text-gray-800">Shape the Future</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We inspire the next generation of African AI leaders who will transform industries and create positive social impact. By connecting our community with global opportunities and resources, we're building a foundation for Africa's AI leadership.
            </p>
          </motion.div>
        </div>
      </section>

      
      {/* Vision Statement */}
      <section className="w-full max-w-6xl mb-16 md:mb-24 py-12 md:py-16 bg-white mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-normal mb-4 text-black">Our Vision</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Building the future of AI in Africa</p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2"
          >
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 p-8 md:p-10 rounded-2xl shadow-lg">
              <svg className="w-12 h-12 text-white mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <p className="text-xl md:text-2xl font-normal text-white leading-relaxed mb-6">
                "We envision TEMPLATE as Africa's AI capital, a place where bold ideas hatch, talent flourishes, and technology shapes a brighter, more inclusive future for all."
              </p>
              <div className="flex items-center">
                <div className="h-1 w-10 bg-white mr-3"></div>
                <span className="text-sm font-normal text-white">Our Promise</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-1/2"
          >
            <h3 className="text-2xl font-normal text-gray-800 mb-4">Next Steps</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              We aim to establish TEMPLATE as a globally recognized hub for AI innovation, with our community members leading groundbreaking research, launching successful startups, and implementing AI solutions that address Africa's most pressing challenges.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-gray-700">Develop a network of 10,000+ AI practitioners across East Africa</p>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-gray-700">Incubate 50+ AI startups addressing local challenges</p>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-gray-700">Establish partnerships with leading global AI research institutions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Spotlight */}
      <section className="w-full max-w-6xl mb-16 md:mb-24 py-12 md:py-16 bg-white mx-auto px-4 sm:px-8">
        
        <CommunitySpotlight />
      </section>
    </main>
  );
};

export default About;
