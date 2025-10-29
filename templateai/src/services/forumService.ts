import { api } from '@/http';

// Thread interface matching the backend data structure
export interface Thread {
  public_id: string;
  title?: string;
  content: string;
  author: {
    public_id: string;
    username: string;
    email: string;
  };
  views: number;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  comments_count: number;
  category: string;
  tags: string[];
}

// Comment interface matching the backend data structure
export interface Comment {
  public_id: string;
  thread: string;
  author: {
    public_id: string;
    username: string;
    email: string;
  };
  content: string;
  created_at: string;
  updated_at: string;
  parent?: string;
  replies: Comment[];
  is_author: boolean;
}

// Thread detail interface with comments
export interface ThreadDetail extends Thread {
  comments: {
    results: Comment[];
    next: string | null;
    has_more: boolean;
  };
}

const handleApiError = (error: any, defaultMessage: string): never => {
  if (error.response || error.request) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401) {
        throw new Error('Authentication required. Please log in to continue.');
      } else if (status === 403) {
        throw new Error('You do not have permission to access this resource.');
      } else if (status === 404) {
        throw new Error('The requested resource was not found.');
      } else if (status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (data && data.error) {
        throw new Error(data.error);
      }
    } else if (error.request) {
      // Network (no response received)
      throw new Error('Network error. Please check your internet connection.');
    }
  }
  
  // For non-Axios errors or unhandled cases
  console.error(defaultMessage, error);
  throw new Error(defaultMessage);
};

export const getAllThreads = async (category?: string): Promise<Thread[]> => {
  try {
    const url = category && category !== 'All' 
      ? `/forum/threads/?category=${encodeURIComponent(category)}` 
      : `/forum/threads/`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch threads. Please try again.');
  }
};

export const getThreadById = async (threadId: string, limit: number = 3): Promise<ThreadDetail> => {
  try {
    const response = await api.get(`/forum/threads/${threadId}/?limit=${limit}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Failed to fetch thread details. Please try again.`);
  }
};

export const createThread = async (threadData: { content: string; category: string; tags?: string[] }): Promise<Thread> => {
  try {
    const response = await api.post(`/forum/threads/`, threadData);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to create thread. Please try again.');
  }
};

export const updateThread = async (threadId: string, threadData: { content?: string; category?: string; tags?: string[] }): Promise<Thread> => {
  try {
    const response = await api.patch(`/forum/threads/${threadId}/`, threadData);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to update thread. Please try again.');
  }
};

export const deleteThread = async (threadId: string): Promise<void> => {
  try {
    await api.delete(`/forum/threads/${threadId}/`);
  } catch (error) {
    return handleApiError(error, 'Failed to delete thread. Please try again.');
  }
};

export const getThreadComments = async (threadId: string, cursor?: string, limit: number = 3): Promise<{ results: Comment[]; next: string | null; has_more: boolean }> => {
  try {
    let url = `/forum/threads/${threadId}/comments/?limit=${limit}`;
    if (cursor) {
      url += `&cursor=${encodeURIComponent(cursor)}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch comments. Please try again.');
  }
};

export const createComment = async (threadId: string, content: string): Promise<Comment> => {
  try {
    const response = await api.post(`/forum/threads/${threadId}/comments/`, { content });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to create comment. Please try again.');
  }
};

export const replyToComment = async (commentId: string, content: string): Promise<Comment> => {
  try {
    const response = await api.post(`/forum/comments/${commentId}/reply/`, { content });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to reply to comment. Please try again.');
  }
};

export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  try {
    const response = await api.put(`/forum/comments/${commentId}/`, { content });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to update comment. Please try again.');
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    await api.delete(`/forum/comments/${commentId}/`);
  } catch (error) {
    return handleApiError(error, `Failed to delete comment. Please try again.`);
  }
};

// Get threads created by a specific user
export const getThreadsByUser = async (userId: string): Promise<Thread[]> => {
  try {
    const response = await api.get(`/forum/threads/?author=${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Failed to fetch user's threads. Please try again.`);
  }
};
