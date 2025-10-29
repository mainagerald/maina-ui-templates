import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { User, Edit, Save, X, Camera, MapPin, Globe, Phone, Calendar, Mail, AtSign, Loader2, MessageCircle, ChevronRight, Hash, Link as LinkIcon, Shield, Users, XCircle, ZoomIn } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { getCurrentUserProfile, updateUserProfile, updateProfileImage, UserProfile, getPublicProfile, PublicProfile } from '../../services/userService';
import { getThreadsByUser, Thread } from '../../services/forumService';
import { ThreadCard } from '../../components/layouts/thread';
import { showSuccessToast, showErrorToast } from '../../components/layouts/toast/miniToast';

const ProfilePage = () => {
  const { isAuthenticated, user } = useAuth();
  const { publicId } = useParams<{ publicId?: string }>();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [publicProfileData, setPublicProfileData] = useState<PublicProfile | null>(null);
  const [error, setError] = useState('');
  const [isViewingOwnProfile, setIsViewingOwnProfile] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    profile: {
      first_name: '',
      last_name: '',
      bio: '',
      location: '',
      website: '',
      phone_number: '',
      date_of_birth: '',
      social_links: {} as Record<string, string>,
      tags: '',
      role: ''
    }
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [imageError, setImageError] = useState('');
  
  // Image modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Thread state
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [showThreads, setShowThreads] = useState(false);
  const [threadError, setThreadError] = useState('');
  
  useEffect(() => {
    if (profileData) {
      setFormData({
        username: profileData.username || '',
        profile: {
          first_name: profileData.profile?.first_name || '',
          last_name: profileData.profile?.last_name || '',
          bio: profileData.profile?.bio || '',
          location: profileData.profile?.location || '',
          website: profileData.profile?.website || '',
          phone_number: profileData.profile?.phone_number || '',
          date_of_birth: profileData.profile?.date_of_birth || '',
          social_links: profileData.profile?.social_links || {},
          tags: profileData.profile?.tags || '',
          role: profileData.profile?.role || 'member'
        }
      });
    }
  }, [profileData]);
  
  useEffect(() => {
    console.log(publicId, user, publicId !== user?.public_id);
    if ((publicId && user && publicId !== user.public_id) || (publicId && !user)) {
      setIsViewingOwnProfile(false);
      fetchPublicProfile(publicId);
    } else {
      setIsViewingOwnProfile(true);
      if (isAuthenticated) {
        fetchUserProfile();
      } else {
        setLoading(false);
      }
    }
  }, [isAuthenticated, publicId, user]);
  
  // Function to fetch user threads
  const fetchUserThreads = async (userPublicId?: string) => {
    const publicIdToUse = userPublicId || user?.public_id;
    if (!publicIdToUse) return;
    
    try {
      setLoadingThreads(true);
      setThreadError('');
      const userThreads = await getThreadsByUser(publicIdToUse);
      setThreads(userThreads);
      // Automatically show threads when viewing someone else's profile
      if (userPublicId && !isViewingOwnProfile) {
        setShowThreads(true);
      }
    } catch (err) {
      console.error('Error fetching user threads:', err);
      setThreadError('Failed to load threads. Please try again.');
    } finally {
      setLoadingThreads(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUserProfile();
      setProfileData(data);
      setError('');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPublicProfile = async (profilePublicId: string) => {
    try {
      setLoading(true);
      const data = await getPublicProfile(profilePublicId);
      setPublicProfileData(data);
      setError('');
      
      setTimeout(() => {
        fetchUserThreads(profilePublicId);
      }, 100);
    } catch (err) {
      console.error('Error fetching public profile:', err);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  console.log("profileData", profileData);
  const renderLoading = () => {
    return (
      <div className="responsive-container mt-16">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-green-700 mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  };
  
  const renderUnauthenticated = () => {
    return (
      <div className="responsive-container mt-16">
        <div className="space-y-8 mt-20 mb-20">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your profile, activities, and connections.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <User className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-gray-600 max-w-md mb-6">
              Please sign in to access your profile and account settings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="bg-green-700 text-white px-6 py-3 rounded-md font-medium hover:bg-green-800 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium hover:bg-gray-300 transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderError = () => {
    return (
      <div className="responsive-container mt-16">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center text-red-500">
            <p>{error}</p>
            <button 
              onClick={() => isViewingOwnProfile ? fetchUserProfile() : (publicId && fetchPublicProfile(publicId))} 
              className="mt-4 px-3 py-1.5 bg-black border border-black text-white rounded-lg hover:bg-black/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderPublicProfile = () => {
    if (!publicProfileData) return null;
    
    return (
      <div className="responsive-container mt-16">
        <div className="space-y-8 mt-20 mb-20">
          <div className="flex items-center pt-6">
            <button 
              onClick={() => window.history.back()}
              className="text-sm flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Forum
            </button>
          </div>
          
          <div className="bg-white shadow-sm border-b border-gray-400 overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-48 bg-gradient-to-r from-blue-700 via-purple-700 to-red-700 rounded-2xl">
              <div className="absolute -bottom-16 left-8">
                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  <img 
                    src={publicProfileData.profile_image || `https://ui-avatars.com/api/?name=${publicProfileData.username || 'User'}&background=random&size=128`} 
                    alt={publicProfileData.full_name || publicProfileData.username || 'User'} 
                    className="h-full w-full object-cover cursor-pointer" 
                    onClick={() => {
                      const imageUrl = publicProfileData.profile_image || 
                        `https://ui-avatars.com/api/?name=${publicProfileData.username || 'User'}&background=random&size=128`;
                      openImageModal(imageUrl);
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Profile Content */}
            <div className="pt-20 px-8 pb-8">
              <div>
                {/* Display Mode */}
                <div className="mb-6">
                  <p className="text-gray-600 flex items-center gap-2">
                    <AtSign size={16} /> {publicProfileData.username}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* About Section */}
                  <div>
                    <h3 className="text-sm mb-3">About</h3>
                    <p className="text-gray-700 mb-6">
                      {publicProfileData.bio || 'No bio provided'}
                    </p>
                    
                    <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {publicProfileData.role}
                    </div>
                    
                    {/* Tags */}
                    {publicProfileData.tags && (
                      <div className="mt-6">
                        <h3 className="text-sm mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {publicProfileData.tags.split(',').map((tag, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs"
                            >
                              <Hash size={12} /> {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm mb-3">Contact Information</h3>
                    
                    {publicProfileData.location && (
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin size={16} className="text-gray-400 mt-0.5" />
                        <span className="text-gray-700">{publicProfileData.location}</span>
                      </div>
                    )}
                    
                    {publicProfileData.website && (
                      <div className="flex items-start gap-2 mb-3">
                        <Globe size={16} className="text-gray-400 mt-0.5" />
                        <a 
                          href={publicProfileData.website.startsWith('http') ? publicProfileData.website : `https://${publicProfileData.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {publicProfileData.website}
                        </a>
                      </div>
                    )}
                    
                    {/* Social Links */}
                    {publicProfileData.social_links && Object.keys(publicProfileData.social_links).length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm mb-3">Social Links</h3>
                        <div className="space-y-3">
                          {Object.entries(publicProfileData.social_links).map(([platform, url]) => (
                            <div key={platform} className="flex items-start gap-2">
                              <LinkIcon size={16} className="text-gray-400 mt-0.5" />
                              <div>
                                <span className="text-xs text-gray-500 block capitalize">{platform}</span>
                                <a 
                                  href={url.startsWith('http') ? url : `https://${url}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  {url}
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Threads Section */}
          <div className="mt-8">
            
            
            {loadingThreads ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : threadError ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">{threadError}</div>
            ) : threads.length > 0 ? (
              <div className="space-y-4">
                {threads.map((thread) => (
                  <ThreadCard key={thread.public_id} thread={thread} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 text-gray-500 p-6 rounded-lg text-center">
                <p>No threads found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Conditional rendering based on state
  if (loading) {
    return renderLoading();
  }
  
  if (!isAuthenticated && !publicId) {
    return renderUnauthenticated();
  }
  
  if (error) {
    return renderError();
  }
  
  // If viewing someone else's profile
  if (!isViewingOwnProfile && publicProfileData) {
    return renderPublicProfile();
  }

  // Hooks are already declared at the top level
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (profile fields)
      const [parent, child] = name.split('.');
      if (parent === 'profile') {
        setFormData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            [child]: value
          }
        }));
      }
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle social link changes
  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        social_links: {
          ...prev.profile.social_links,
          [platform]: value
        }
      }
    }));
  };
  
  // Handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (3MB limit)
      const maxSize = 3 * 1024 * 1024;
      if (file.size > maxSize) {
        setImageError(`Image size exceeds 3MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    
    try {
      // Create a proper update payload with only the fields we want to update
      const updatePayload = {
        username: formData.username,
        profile: {
          first_name: formData.profile.first_name,
          last_name: formData.profile.last_name,
          bio: formData.profile.bio,
          location: formData.profile.location,
          website: formData.profile.website,
          phone_number: formData.profile.phone_number,
          date_of_birth: formData.profile.date_of_birth,
          social_links: formData.profile.social_links,
          tags: formData.profile.tags
          // Note: role is not included as it should typically be managed by admins only
        }
      };

      
      
      // Update profile data
      const updatedProfile = await updateUserProfile(updatePayload);
      
      // If there's a new image, upload it
      if (imageFile) {
        await updateProfileImage(imageFile);
      }
      
      // Fetch the latest profile data to ensure we have the most up-to-date information
      await fetchUserProfile();
      
      // Show success toast notification
      showSuccessToast('Profile updated successfully');
      
      // Update UI state
      setIsEditing(false);
      setSaveError('');
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError('Failed to update profile. Please try again.');
      showErrorToast('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  console.log(profileData);
  
  // Function to format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Handle View Threads button click
  const handleViewThreads = () => {
    if (!showThreads) {
      // If viewing own profile, use current user's public_id
      // If viewing someone else's profile, use the publicId from URL params
      const publicIdToUse = isViewingOwnProfile ? user?.public_id : publicId;
      if (publicIdToUse) {
        fetchUserThreads(publicIdToUse);
      }
    }
    setShowThreads(!showThreads);
  };
  
  // Open image modal
  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setShowImageModal(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  // Close image modal
  const closeImageModal = () => {
    setShowImageModal(false);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };
  
  return (
    <div className="responsive-container mt-16">
      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={closeImageModal}>
          <div className="relative max-w-xl max-h-[50vh] overflow-hidden rounded-3xl">
            <button
              className="absolute top-4 right-4 p-1 bg-black rounded-xl text-white hover:bg-opacity-70 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                closeImageModal();
              }}
            >
              <X size={28} />
            </button>
            <img
              src={modalImage}
              alt="Profile Image"
              className="max-h-[90vh] max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      
      <div className="space-y-8 mt-20 mb-20">
        {isViewingOwnProfile && (
          <div className="flex justify-between items-center">          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-10 flex items-center gap-2 bg-black text-white px-3 py-1 rounded-3xl hover:bg-black/80 transition-colors"
            >
              <Edit size={16} /> Edit Profile
            </button>
          ) : (
            <div className="mt-10 flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-1 rounded-3xl hover:bg-gray-300 transition-colors"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 bg-black text-white px-3 py-1 rounded-3xl hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
              </button>
            </div>
          )}
        </div>
        )}
        
        {saveError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{saveError}</span>
          </div>
        )}
        
        <div className="bg-white shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-700 via-purple-700 to-red-700 rounded-2xl">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  {isEditing && imagePreview ? (
                    <div className="relative h-full w-full">
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="h-full w-full object-cover" 
                        onClick={() => openImageModal(imagePreview)}
                      />
                      <div className="absolute bottom-0 right-0 p-1 bg-black bg-opacity-50 rounded-tl-md cursor-pointer"
                           onClick={() => {
                             setImagePreview(null);
                             setImageFile(null);
                             if (fileInputRef.current) {
                               fileInputRef.current.value = '';
                             }
                           }}>
                        <X size={16} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={profileData?.profile?.profile_image || `https://ui-avatars.com/api/?name=${profileData?.username || 'User'}&background=random&size=128`} 
                      alt={profileData?.profile?.full_name || profileData?.username || 'User'} 
                      className="h-full w-full object-cover cursor-pointer" 
                      onClick={() => {
                        const imageUrl = profileData?.profile?.profile_image || 
                          `https://ui-avatars.com/api/?name=${profileData?.username || 'User'}&background=random&size=128`;
                        openImageModal(imageUrl);
                      }}
                    />
                  )}
                  
                  {isEditing && (
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 cursor-pointer group hover:bg-opacity-70 transition-all rounded-full">
                      <Camera className="text-white h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-white text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Max 3MB
                      </span>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
                {imageError && (
                  <div className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded-md">
                    {imageError}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          name="profile.first_name"
                          value={formData.profile.first_name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          name="profile.last_name"
                          value={formData.profile.last_name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        name="profile.bio"
                        value={formData.profile.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Contact Information</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        name="profile.location"
                        value={formData.profile.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        name="profile.website"
                        value={formData.profile.website}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="profile.phone_number"
                        value={formData.profile.phone_number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                    
                    
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                      <input
                        type="text"
                        name="profile.tags"
                        value={formData.profile.tags}
                        onChange={handleInputChange}
                        placeholder="Comma-separated tags (e.g., developer, designer, AI)"
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                {/* Display Mode */}
                <div className="mb-6">
                  <p className="text-gray-600 flex items-center gap-2">
                    <AtSign size={16} /> {profileData?.username}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <Mail size={16} /> {profileData?.email}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* About Section */}
                  <div>
                    <h3 className="text-sm mb-3">About</h3>
                    <p className="text-gray-700 mb-6">
                      {profileData?.profile?.bio || 'No bio provided'}
                    </p>
                    
                    {/* <h3 className="text-sm mb-3">Role</h3> */}
                    <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {profileData?.profile?.role}
                    </div>
                    
                    {(user?.role === 'admin' || user?.role === 'super' || user?.role === 'moderator') && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium mb-2">Admin Access</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          You have administrative privileges. Access the admin dashboard to manage content, users, and site settings.
                        </p>
                        <div className="flex flex-col space-y-2">
                          <a 
                            href="/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gradient-to-b from-blue-700 via-purple-700 to-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                          >
                            <Shield size={16} />
                            Admin Dashboard
                          </a>
                          {(user?.role === 'admin' || user?.role === 'super') && (
                            <a 
                              href="/admin/users"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                            >
                              <Users size={16} />
                              User Management
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3">Contact Information</h3>
                    <ul className="space-y-3">
                      {profileData?.profile?.location && (
                        <li className="flex items-center gap-2 text-gray-700">
                          <MapPin size={16} className="text-gray-500" />
                          <span>{profileData.profile.location}</span>
                        </li>
                      )}
                      
                      {profileData?.profile?.website && (
                        <li className="flex items-center gap-2 text-gray-700">
                          <Globe size={16} className="text-gray-500" />
                          <a 
                            href={profileData.profile.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-700 hover:underline"
                          >
                            {profileData.profile.website}
                          </a>
                        </li>
                      )}
                      
                      {profileData?.profile?.phone_number && (
                        <li className="flex items-center gap-2 text-gray-700">
                          <Phone size={16} className="text-gray-500" />
                          <span>{profileData.profile.phone_number}</span>
                        </li>
                      )}
                      
                      {profileData?.profile?.date_of_birth && (
                        <li className="flex items-center gap-2 text-gray-700">
                          <Calendar size={16} className="text-black" />
                          <span>Born {formatDate(profileData.profile.date_of_birth)}</span>
                        </li>
                      )}
                      
                      {profileData?.profile?.tags && (
                        <li className="flex items-center gap-2 text-gray-700">
                          <User size={16} className="text-gray-500" />
                          <span>Tags: {profileData.profile.tags}</span>
                        </li>
                      )}
                    </ul>
                    
                    <div className="mt-6">
                      <h3 className="text-sm mb-3">Account Information</h3>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium text-sm">Joined:</span> {formatDate(profileData?.profile?.created_at || null)}
                      </p>
                      {/* <p className="text-gray-700">
                        <span className="font-medium">Last updated:</span> {formatDate(profileData?.profile?.updated_at || null)}
                      </p> */}
                    </div>
                    
                    {/* Social Links */}
                    {Object.keys(profileData?.profile?.social_links || {}).length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg mb-3">Social Links</h3>
                        <ul className="space-y-3">
                          {Object.entries(profileData?.profile?.social_links || {}).map(([platform, url]) => (
                            url && (
                              <li key={platform} className="flex items-center gap-2 text-gray-700">
                                <LinkIcon size={16} className="text-gray-500" />
                                <span className="capitalize">{platform}:</span>
                                <a 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-green-700 hover:underline"
                                >
                                  {url}
                                </a>
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* User Threads Section */}
        <section className="bg-white border-0 border-gray-200 rounded-lg shadow-sm overflow-hidden mt-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-700" />
                My Threads
              </h2>
              
              <button
                onClick={handleViewThreads}
                className="flex items-center gap-1 text-green-700 hover:text-green-800 transition-colors text-sm font-medium"
              >
                {showThreads ? 'Hide Threads' : 'View Threads'}
                <ChevronRight size={16} className={`transition-transform ${showThreads ? 'rotate-90' : ''}`} />
              </button>
            </div>
            
            {showThreads && (
              <div className="mt-4">
                {loadingThreads ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-green-700" />
                  </div>
                ) : threadError ? (
                  <div className="text-center text-red-500 py-8">
                    <p>{threadError}</p>
                    <button
                      onClick={() => fetchUserThreads()}
                      className="mt-2 text-green-700 hover:text-green-800 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : threads.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No threads created yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {threads.map((thread) => (
                      <ThreadCard key={thread.public_id} thread={thread} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
