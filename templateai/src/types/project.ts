/**
 * Project type definitions
 */

export interface KeyFeature {
  public_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
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
  status: 'pending' | 'approved' | 'rejected';
  stars: number;
  forks: number;
  users: number;
  views: number;
  created_at: string;
  updated_at: string;
  key_features: KeyFeature[];
}

export interface ProjectFilter {
  industry?: string;
  technologies?: string[];
  tools?: string[];
  is_reviewed?: boolean;
}

export interface ProjectCreateRequest {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  technologies: string[];
  tools: string[];
  industry: string;
}

export interface ProjectUpdateRequest {
  title?: string;
  description?: string;
  image?: string;
  tags?: string[];
  technologies?: string[];
  tools?: string[];
  industry?: string;
}

export interface ProjectModerationRequest {
  is_reviewed?: boolean;
  is_featured?: boolean;
}
