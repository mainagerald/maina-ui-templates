import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Code, Users, Zap, ArrowRight, Bot, Bell, Calendar, CreditCard, FileText, MessageSquare, Sparkles, ArrowRightSquare, ArrowUpRightFromSquare } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { getAllProjects } from '@/services/projectService';
import { showSuccessToast, showErrorToast } from '@/components/layouts/toast/miniToast';
import ProjectSubmissionForm from './ProjectSubmissionForm';

// Project interface
// Import KeyFeature interface from types
import { KeyFeature } from '@/types/project';
import { Spinner } from '@/components/layouts/state';

interface Project {
  public_id: string;
  id?: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  technologies: string[];
  tools: string[];
  industry: string;
  creator: {
    public_id: string;
    username: string;
    email: string;
  };
  is_reviewed: boolean;
  is_featured: boolean;
  stars: number;
  forks: number;
  users: number;
  views: number;
  created_at: string;
  updated_at: string;
  key_features: KeyFeature[];
}

// Project tag component
const ProjectTag = ({ tag }: { tag: string }) => (
  <span className="inline-block bg-green-700/20 text-green-700 px-2 py-1 text-xs rounded-full">
    {tag}
  </span>
);

// Project card component
const ProjectCard = ({ project }: { project: Project }) => (
  <Link to={`/projects/${project.public_id}`} className="block">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="h-48 overflow-hidden">
        <img src={project.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex gap-2 mb-3 flex-wrap">
          {project.tags.map((tag: string, index: number) => (
            <ProjectTag key={index} tag={tag} />
          ))}
        </div>
        
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{project.description.substring(0, 100)}...</p>
          
          {/* Key Features */}
          {project.key_features && project.key_features.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Key Features</h4>
              <div className="flex flex-wrap gap-2">
                {project.key_features.slice(0, 2).map((feature) => (
                  <span key={feature.public_id} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {feature.name}
                  </span>
                ))}
                {project.key_features.length > 2 && (
                  <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">+{project.key_features.length - 2} more</span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <img src={`https://ui-avatars.com/api/?name=${project.creator.username}&background=random`} alt={project.creator.username} className="w-8 h-8 rounded-full mr-2" />
            <span className="text-sm text-gray-700">{project.creator.username}</span>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Star size={16} className="mr-1" />
            <span>{project.stars}</span>
          </div>
          <div className="flex items-center">
            <Code size={16} className="mr-1" />
            <span>{project.forks}</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>{project.users}</span>
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

const KeyFeatureCard = ({ feature }: { feature: KeyFeature }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-md font-semibold mb-2">{feature.name}</h4>
      <p className="text-gray-600 text-sm">{feature.description}</p>
    </div>
  );
};

// Featured project component
const FeaturedProject = ({ project }: { project: Project }) => {
  // Calculate a progress percentage based on project activity (stars, forks, views)
  const progress = Math.min(100, Math.round((project.stars + project.forks + project.views / 10) / 5));
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-transparent overflow-hidden"
    >
      <div className="relative h-full min-h-[60vh]">
        <img 
          src={project.image || 'https://via.placeholder.com/800x600?text=No+Image'} 
          alt={project.title} 
          className="absolute inset-0 w-full h-full object-cover rounded-2xl" 
        />
        <div className="absolute inset-0 bg-transparent flex flex-col justify-end p-6">
          <div className="flex gap-2 mb-3 flex-wrap">
            {project.tags.map((tag: string, index: number) => (
              <span key={index} className="inline-block bg-green-700/80 text-white px-3 py-1 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
          <div className="flex items-center text-white/80">
            <img 
              src={`https://ui-avatars.com/api/?name=${project.creator.username}&background=random`} 
              alt={project.creator.username} 
              className="w-8 h-8 rounded-full mr-2" 
            />
            <span>{project.creator.username}</span>
          </div>
        </div>
      </div>
      
      <div className="p-8 flex flex-col">
        <p className="text-gray-700 mb-6 text-lg">{project.description}</p>
        
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Project Activity</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-700 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">{project.stars}</div>
            <div className="text-xs text-gray-500 flex items-center justify-center">
              <Star size={12} className="mr-1" /> Stars
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{project.forks}</div>
            <div className="text-xs text-gray-500 flex items-center justify-center">
              <Code size={12} className="mr-1" /> Forks
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{project.users}</div>
            <div className="text-xs text-gray-500 flex items-center justify-center">
              <Users size={12} className="mr-1" /> Users
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 mt-auto">
          {/* {project.is_featured && (
            <div
              className="inline-block bg-black text-white py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <Zap size={18} className="mr-2" />
              Featured Project
            </div>
          )} */}
          <Link 
            to={`/projects/${project.public_id}`}
            className="inline-block bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            View
            <ArrowUpRightFromSquare size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Feature list component
const FeatureList = () => {
  const features = [
    {
      icon: <Bot className="h-6 w-6 text-green-700" />,
      title: 'Agentic Automation',
      description: 'AI agents that autonomously handle the entire invoicing workflow from creation to collection.'
    },
    {
      icon: <Bell className="h-6 w-6 text-green-700" />,
      title: 'Smart Reminders',
      description: 'Contextually aware payment reminders that adapt tone and frequency based on client history.'
    },
    {
      icon: <Calendar className="h-6 w-6 text-green-700" />,
      title: 'Payment Scheduling',
      description: 'Intelligent scheduling of invoices based on optimal payment timing for your cash flow.'
    },
    {
      icon: <CreditCard className="h-6 w-6 text-green-700" />,
      title: 'Payment Processing',
      description: 'Seamless integration with payment processors to enable instant payments and reconciliation.'
    },
    {
      icon: <FileText className="h-6 w-6 text-green-700" />,
      title: 'Contract Analysis',
      description: 'Extract payment terms from contracts to automatically create accurate invoice schedules.'
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-green-700" />,
      title: 'Client Communication',
      description: 'Natural language communication with clients about invoices and payments.'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-inherit p-6 transition-all duration-300"
        >
          <div className="bg-green-700/10 p-3 rounded-full w-fit mb-4">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-gray-600 text-sm">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Main projects page component
const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  
  // Filtering state
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  
  // Fetch all projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Get all projects at once without server-side filtering
        const data = await getAllProjects();
        
        if (data.length > 0) {
          // Filter projects in the frontend
          let filteredProjects = [...data];
          
          // Apply industry filter if selected
          if (selectedIndustry) {
            filteredProjects = filteredProjects.filter(p => p.industry === selectedIndustry);
          }
          
          // Apply technologies filter if selected
          if (selectedTechnologies.length > 0) {
            filteredProjects = filteredProjects.filter(p => 
              selectedTechnologies.some(tech => p.technologies.includes(tech))
            );
          }
          
          // Find a featured project (either marked as featured or the first one)
          const featured = filteredProjects.find(p => p.is_featured) || filteredProjects[0];
          setFeaturedProject(featured);
          
          // Set remaining projects
          setProjects(filteredProjects.filter(p => p.public_id !== featured?.public_id));
        } else {
          setFeaturedProject(null);
          setProjects([]);
        }
        
        setError('');
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [selectedIndustry, selectedTechnologies]);
  
  // Display loading state
  if (loading) {
    return (
      <main className="responsive-container mt-16">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Spinner />
            <p className="text-gray-600">Loading projects...</p>
          </div>
        </div>
      </main>
    );
  }
  
  // Display error state
  if (error) {
    return (
      <main className="responsive-container mt-16">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="responsive-container mt-16 ">
      {showSubmissionForm && <ProjectSubmissionForm onClose={() => setShowSubmissionForm(false)} />}
      <div className="space-y-8 mt-20 mb-20 bg-transparent">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-start mb-2 bg-inherit"
        >
          <h1 className="text-xl text-black md:text-3xl font-medium mb-2 font-sans">Project Showcase</h1>
          <p className="text-sm text-gray-600 max-w-3xl">
            Explore innovative AI projects built by our community members to solve real-world problems.
          </p>
        </motion.section>
        
        {/* Featured Project */}
        <section className="mb-16 pt-0 bg-inherit">
            <h2 className="text-xl font-semibold p-4 mb-4 font-sans">Featured Project</h2>
          {featuredProject && <FeaturedProject project={featuredProject} />}
          {!featuredProject && (
            <div className="p-8 text-center text-gray-500">
              <p>No featured projects available yet.</p>
            </div>
          )}
        </section>
        
        {/* Key Features */}
        <section className="mb-16 bg-transparent">
          {featuredProject?.key_features && featuredProject.key_features.length > 0 && (
            <div className="text-center mb-12">
              <h2 className="text-lg font-bold mb-2 font-sans">Key Features of {featuredProject?.title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
               {featuredProject?.description}
              </p>
            </div>
          )}
          
          {featuredProject?.key_features && featuredProject.key_features.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProject.key_features.map((feature) => (
                <motion.div
                  key={feature.public_id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="bg-green-700/10 p-3 rounded-full w-fit mb-4">
                    <Sparkles className="h-6 w-6 text-green-700" />
                  </div>
                  <h3 className="text-lg mb-2">{feature.name}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500">
              <p>No key features available for this project.</p>
            </div>
          )}
        </section>
        
        {/* Project Gallery */}
        <section className="mb-16 bg-transparent">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Other Projects</h2>
            
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project: Project) => (
                <ProjectCard key={project.public_id} project={project} />
              ))
            ) : (
              <div className="col-span-3 p-8 text-center text-gray-500">
                <p>No other projects available yet.</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Call to Action */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-black text-white p-10 rounded-2xl text-center"
        >
<Sparkles className="h-12 w-12 mx-auto mb-6 bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent" />
<h2 className="text-3xl font-semibold mb-4">Want to Showcase a Project?</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Our community of innovators and developers is always looking for new and innovative projects to showcase. We apppreciate interest in all fields and we welcome all submissions.
          </p>
          <button 
            onClick={() => setShowSubmissionForm(true)}
            className="inline-block max-w-fit flex items-center justify-center bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-full text-lg font-medium transition-all duration-300"
          >
            Submit Your Project <ArrowRight size={16} className="ml-1" />
          </button>
        </motion.section>
      </div>
    </main>
  );
};

export default ProjectsPage;
