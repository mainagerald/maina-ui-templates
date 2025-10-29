import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { getUnreviewedProjects } from '@/services/projectService';

interface Notification {
  id: string;
  type: 'project_approval' | 'system' | 'user';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  fetchPendingProjects: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Fetch pending projects and create notifications for them
  const fetchPendingProjects = async () => {
    // Only fetch for admin/moderator users
    if (!user || !['admin', 'super', 'moderator'].includes(user.role)) {
      return;
    }
    
    try {
      const projects = await getUnreviewedProjects();
      
      // Create notifications for unreviewed projects
      const existingProjectIds = notifications
        .filter(n => n.type === 'project_approval')
        .map(n => n.data?.projectId);
      
      projects.forEach(project => {
        // Only add if not already in notifications
        if (!existingProjectIds.includes(project.public_id)) {
          addNotification({
            type: 'project_approval',
            title: 'Project Approval Request',
            message: `"${project.title}" by ${project.creator.username} needs review`,
            link: `/admin/projects`,
            data: {
              projectId: project.public_id,
              projectTitle: project.title,
              creatorName: project.creator.username
            }
          });
        }
      });
    } catch (error) {
      console.error('Error fetching pending projects:', error);
    }
  };
  
  // Check for pending projects on initial load and periodically
  useEffect(() => {
    if (user && ['admin', 'super', 'moderator'].includes(user.role)) {
      // Initial fetch
      fetchPendingProjects();
      
      // Set up interval to check periodically (every 5 minutes)
      const interval = setInterval(fetchPendingProjects, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, [user]);
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        fetchPendingProjects
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
