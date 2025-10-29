import axiosInstance from '../http/axiosInterceptor';

export interface Resource {
  public_id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  image_url?: string;
  source: string;
  source_name: string;
  region: string;
  resource_type: string;
  tags: string[];
  published_date: string;
  fetched_date?: string;
  expiry_date?: string;
  is_featured: boolean;
  views: number;
  share_count?: number;
  relevance_score?: number;
  summary?: string;
  status?: 'approved' | 'pending' | 'discarded';
  fetched_by?: string;
}

export interface ResourceListResponse {
  count: number;
  next: boolean;
  results: Resource[];
}

// Get resources with optional filtering and pagination
export const getResources = async (
  status?: string,
  region?: string,
  resourceType?: string,
  featured?: boolean,
  limit: number = 10,
  offset: number = 0,
): Promise<ResourceListResponse> => {
  const params: Record<string, string | number> = { limit, offset };
  
  if (region) params.region = region;
  if (resourceType) params.type = resourceType;
  if (featured) params.featured = 'true';
  if (status) params.status = status;
  
  const response = await axiosInstance.get('/feed/resources/', { params });
  console.log("response from resourceService", response.data)
  return response.data;
};

// Get a specific resource by ID
export const getResourceById = async (resourceId: string): Promise<Resource> => {
  const response = await axiosInstance.get(`/resources/${resourceId}/`);
  return response.data;
};

// Share a resource
export const shareResource = async (
  resourceId: string, 
  platform: string = 'other'
): Promise<any> => {
  const response = await axiosInstance.post(
    `/resources/${resourceId}/share/`, 
    { platform }
  );
  return response.data;
};

// Admin functions

// Create a new resource (admin only)
export const createResource = async (resourceData: any): Promise<Resource> => {
  const response = await axiosInstance.post(
    `/resources/admin/create/`, 
    resourceData
  );
  return response.data;
};

// Update a resource (admin only)
export const updateResource = async (resourceId: string, resourceData: any): Promise<Resource> => {
  const response = await axiosInstance.put(
    `/resources/admin/${resourceId}/`, 
    resourceData
  );
  return response.data;
};

// Delete a resource (admin only)
export const deleteResource = async (resourceId: string): Promise<void> => {
  await axiosInstance.delete(`/resources/admin/${resourceId}/`);
};

// Trigger the resource fetcher agent (admin only)
export const triggerResourceFetcher = async (): Promise<any> => {
  const response = await axiosInstance.post(
    `/resources/admin/fetch/`, 
    {}
  );
  return response.data;
};

// Feed resources management (admin/moderator only)

export const getFeedResources = async (status?: string): Promise<ResourceListResponse> => {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  
  const response = await axiosInstance.get('/feed/resources/', { params });
  return response.data;
};

// Get all pending feed resources that need review
export const getPendingFeedResources = async (): Promise<ResourceListResponse> => {
  const response = await axiosInstance.get('/feed/resources/pending/');
  return response.data;
};

// Approve a pending feed resource
export const approveFeedResource = async (resourceId: string): Promise<Resource> => {
  const response = await axiosInstance.patch(`/feed/resources/${resourceId}/approve/`);
  return response.data;
};

// Reject a feed resource (marks it as discarded)
export const rejectFeedResource = async (resourceId: string): Promise<Resource> => {
  const response = await axiosInstance.patch(`/feed/resources/${resourceId}/reject/`);
  return response.data;
};

// Update the summary of a feed resource
export const updateFeedResourceSummary = async (resourceId: string, summary: string): Promise<Resource> => {
  const response = await axiosInstance.patch(
    `/feed/resources/${resourceId}/update_summary/`, 
    { summary }
  );
  return response.data;
};
