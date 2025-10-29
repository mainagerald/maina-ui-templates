import axiosInstance from '../http/axiosInterceptor';
import { User } from '../auth/AuthContext';

// Profile interface based on the backend Profile model
export interface Profile {
  id: number;
  public_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  bio: string;
  profile_image: string | null;
  location: string;
  website: string;
  social_links: Record<string, string>;
  phone_number: string;
  tags: string;
  date_of_birth: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

// UserProfile combines User and Profile data
export interface UserProfile extends User {
  profile: Profile;
}

// Get the current user's profile
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get('/users/profile/');
  return response.data;
};

// ProfileUpdatePayload type for profile updates
export interface ProfileUpdatePayload {
  username?: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    location?: string;
    website?: string;
    phone_number?: string;
    date_of_birth?: string | null;
    social_links?: Record<string, string>;
    tags?: string;
  };
}

// Update the current user's profile
export const updateUserProfile = async (profileData: ProfileUpdatePayload): Promise<UserProfile> => {
  const response = await axiosInstance.patch('/users/profile/', profileData);
  return response.data;
};

// Update profile image
export const updateProfileImage = async (imageFile: File): Promise<Profile> => {
  const formData = new FormData();
  formData.append('profile.profile_image', imageFile);
  
  const response = await axiosInstance.patch('/users/profile/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.profile;
};

// Get user profile by ID
export const getUserProfileById = async (userId: string): Promise<UserProfile> => {
  const response = await axiosInstance.get(`/users/${userId}/`);
  return response.data;
};

// Public profile interface with only public information
export interface PublicProfile {
  public_id: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  bio: string;
  profile_image: string | null;
  location: string;
  website: string;
  social_links: Record<string, string>;
  tags: string;
  role: string;
  created_at: string;
}

// Get public profile information by public_id
export const getPublicProfile = async (publicId: string): Promise<PublicProfile> => {
  const response = await axiosInstance.get(`/users/public-profile/${publicId}/`);
  return response.data;
};
