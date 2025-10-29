import { api } from '@/http';
import axiosInstance from '../http/axiosInterceptor';
import { Project, ProjectCreateRequest as ProjectCreateData, ProjectUpdateRequest as ProjectUpdateData } from '../types/project';

// Define moderation request interface
export interface ProjectModerationRequest {
  status?: 'pending' | 'approved' | 'rejected';
  is_reviewed?: boolean;
  is_featured?: boolean;
  feedback?: string;
}

// Get all projects with optional filtering
export const getAllProjects = async (
  industry?: string,
  technologies?: string[],
  tools?: string[],
  featured?: boolean
): Promise<Project[]> => {
  const params: Record<string, string> = {};
  
  if (industry) params.industry = industry;
  if (technologies?.length) params.technologies = technologies.join(',');
  if (tools?.length) params.tools = tools.join(',');
  if (featured) params.featured = 'true';
  
  const response = await api.get('/projects/', { params });
  console.log("params", params);
  console.log("response", response.data);
  return response.data;
};

// Get a specific project by ID
export const getProjectById = async (projectId: string): Promise<Project> => {
  const response = await api.get(`/projects/${projectId}/`);
  return response.data;
};

// Create a new project
export const createProject = async (projectData: ProjectCreateData): Promise<Project> => {
  try {
    // Check if we have an image as a File object or base64 string
    if (projectData.image && typeof projectData.image === 'string' && projectData.image.startsWith('data:')) {
      // Convert base64 to file if needed
      const formData = new FormData();
      
      // Convert base64 to blob
      const base64Response = await fetch(projectData.image);
      const blob = await base64Response.blob();
      const file = new File([blob], 'project-image.jpg', { type: 'image/jpeg' });
      
      // Add file to form data
      formData.append('image', file);
      
      // Add other project data as properly typed values
      formData.append('title', projectData.title);
      formData.append('description', projectData.description);
      formData.append('industry', projectData.industry);
      
      // Handle arrays by stringifying them
      if (projectData.tags && projectData.tags.length > 0) {
        formData.append('tags', JSON.stringify(projectData.tags));
      }
      
      if (projectData.technologies && projectData.technologies.length > 0) {
        formData.append('technologies', JSON.stringify(projectData.technologies));
      }
      
      if (projectData.tools && projectData.tools.length > 0) {
        formData.append('tools', JSON.stringify(projectData.tools));
      }
      
      // Handle key features if present
      if ('key_features' in projectData && Array.isArray(projectData.key_features)) {
        formData.append('key_features', JSON.stringify(projectData.key_features));
      }
      
      console.log('Submitting project with image upload');
      const response = await api.post('/projects/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } else {
      // Regular JSON submission
      console.log('Submitting project as JSON');
      const response = await api.post('/projects/', projectData);
      return response.data;
    }
  } catch (error) {
    console.error('Error in createProject service:', error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (projectId: string, projectData: ProjectUpdateData): Promise<Project> => {
  const response = await api.patch(`/projects/${projectId}/`, projectData);
  return response.data;
};

// Delete a project
export const deleteProject = async (projectId: string): Promise<void> => {
  await api.delete(`/projects/${projectId}/`);
};

export const getUnreviewedProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects/', { 
    params: { unreviewed: 'true' }
  });
  console.log("response", response.data);
  return response.data;
};

// For moderators - approve or feature a project
export const moderateProject = async (
  projectId: string, 
  moderationData: ProjectModerationRequest
): Promise<Project> => {
  const response = await api.patch(`/projects/${projectId}/`, moderationData);
  return response.data;
};
