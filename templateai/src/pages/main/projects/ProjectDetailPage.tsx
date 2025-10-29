import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Code, Users, ArrowLeft, Sparkles, ExternalLink } from 'lucide-react';
import { getProjectById } from '@/services/projectService';
import { Project, KeyFeature } from '@/types/project';
import { Spinner } from '@/components/layouts/state';

// Key Feature Card component
const KeyFeatureCard = ({ feature }: { feature: KeyFeature }) => {
  return (
    <div className="p-4 shadow-sm min-h-[200px] transition-shadow">
      <h4 className="text-md mb-2 text-blue-700">{feature.name}</h4>
      <p className="text-gray-600 text-sm">{feature.description}</p>
    </div>
  );
};

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getProjectById(id);
        setProject(data);
        setError('');
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  console.log("project", project)

  // Display loading state
  if (loading) {
    return (
      <main className="responsive-container mt-16">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Spinner />
            <p className="text-gray-600">Loading project details...</p>
          </div>
        </div>
      </main>
    );
  }

  // Display error state
  if (error || !project) {
    return (
      <main className="responsive-container mt-16">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center text-red-500">
            <p>{error || 'Project not found'}</p>
            <Link 
              to="/projects" 
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors inline-block"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Calculate a progress percentage based on project activity (stars, forks, views)
  const progress = Math.min(100, Math.round((project.stars + project.forks + project.views / 10) / 5));

  return (
    <main className="responsive-container mt-20">
      <div className="space-y-8 pt-8 mt-20 mb-20">
        {/* Back button */}
        <div className="mb-3">
          <Link 
            to="/projects" 
            className="inline-flex items-center text-black hover:text-green-800 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Projects
          </Link>
        </div>

        {/* Project Hero */}
        <section className="mb-12 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="relative h-[400px] lg:h-full">
              <img 
                src={project.image || 'https://via.placeholder.com/800x600?text=No+Image'} 
                alt={project.title} 
                className="w-full h-full object-cover rounded-2xl" 
              />
              {project.is_featured && (
                <div className="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <Sparkles size={14} className="mr-1" />
                  Featured
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <div className="flex gap-2 mb-3 flex-wrap">
                {project.tags?.map((tag: string, index: number) => (
                  <span key={index} className="inline-block bg-green-700/20 text-green-700 px-2 py-1 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
              
              <div className="flex items-center mb-6">
                <img 
                  src={`https://ui-avatars.com/api/?name=${project.creator.username}&background=random`} 
                  alt={project.creator.username} 
                  className="w-8 h-8 rounded-full mr-2" 
                />
                <span className="text-gray-700">{project.creator.username}</span>
              </div>
              
              <p className="text-gray-700 mb-6">{project.description}</p>
              
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
              
              <div className="mt-auto">
                <a 
                  href="#" 
                  className="inline-block bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-green-800 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Project
                  <ExternalLink size={18} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Key Features */}
        <section className="mb-12 bg-white">
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          
          {project.key_features && project.key_features.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.key_features.map((feature) => (
                <motion.div
                  key={feature.public_id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <KeyFeatureCard feature={feature} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No key features available for this project.</p>
            </div>
          )}
        </section>
        
        {/* Technologies & Tools */}
        <section className="bg-white mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Technologies</h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Tools</h2>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-md"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>
        
        {/* Project Info */}
        <section className="bg-white mb-12">
          <h2 className="text-2xl font-bold mb-6">Project Information</h2>
          <div className=" p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Industry</h3>
                <p className="font-medium">{project.industry}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Created</h3>
                <p className="font-medium">{new Date(project.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Last Updated</h3>
                <p className="font-medium">{new Date(project.updated_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm mb-1">Views</h3>
                <p className="font-medium">{project.views}</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Projects (placeholder for future implementation) */}
        
      </div>
    </main>
  );
};

export default ProjectDetailPage;
