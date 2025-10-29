import { api } from '@/http';

const API_URL = import.meta.env.VITE_API_URL;

// Event interface matching the backend data structure
export interface Event {
  public_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  end_date?: string;
  location: string;
  type: string;
  image?: string;
  imageUrl?: string;
  organizer: {
    public_id: string;
    username: string;
    email: string;
  };
  max_attendees?: number;
  registration_required: boolean;
  registration_deadline?: string;
  is_featured: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  registrations_count: number;
}

export interface Speaker {
  public_id: string;
  name: string;
  role: string;
  linkedinUrl?: string;
  imageUrl?: string;
  created_at: string;
  updated_at: string;
}

export interface AgendaItem {
  public_id: string;
  time: string;
  title: string;
  description?: string;
  speaker_id?: string;
  speaker_name?: string;
  speaker_role?: string;
  created_at: string;
  updated_at: string;
}

export interface Agenda {
  public_id: string;
  items: AgendaItem[];
  created_at: string;
  updated_at: string;
}

export interface EventDetail extends Event {
  registrations: EventRegistration[];
  is_registered: boolean;
  speakers: Speaker[];
  agenda?: Agenda;
}

export interface EventRegistration {
  id: number;
  public_id: string;
  event: string;
  attendee: {
    public_id: string;
    username: string;
    email: string;
  };
  registration_date: string;
  attended: boolean;
}

// Helper function to handle API errors
const handleApiError = (error: any, defaultMessage: string): never => {
  if (error.response || error.request) {
    // Handle Axios errors with response data
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      // Create a more descriptive error message based on status code
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
      // Network error (no response received)
      throw new Error('Network error. Please check your internet connection.');
    }
  }
  
  // For non-Axios errors or unhandled cases
  console.error(defaultMessage, error);
  throw new Error(defaultMessage);
};

// Get all events
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get(`/events/`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch events. Please try again.');
    return [];
  }
};

// Get upcoming events
export const getUpcomingEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get(`/events/upcoming/`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch upcoming events. Please try again.');
    return [];
  }
};

// Get featured events
export const getFeaturedEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get(`/events/featured/`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch featured events. Please try again.');
    return [];
  }
};

// Get event details by ID
export const getEventById = async (eventId: string): Promise<EventDetail> => {
  try {
    const response = await api.get(`/events/${eventId}/`);
    return response.data;
  } catch (error) {
    return handleApiError(error, `Failed to fetch event details. Please try again.`);
  }
};

// Register for an event (requires authentication)
export const registerForEvent = async (eventId: string): Promise<EventRegistration> => {
  try {
    const response = await api.post(`/events/${eventId}/register/`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to register for this event. Please try again.');
  }
};

// Cancel registration for an event (requires authentication)
export const cancelEventRegistration = async (eventId: string): Promise<void> => {
  try {
    await api.delete(`/events/${eventId}/cancel-registration/`);
  } catch (error) {
    return handleApiError(error, 'Failed to cancel registration. Please try again.');
  }
};

// Get speakers for an event
export const getEventSpeakers = async (eventId: string): Promise<Speaker[]> => {
  try {
    const response = await api.get(`/events/${eventId}/speakers/`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch event speakers. Please try again.');
  }
};

// Get agenda for an event
export const getEventAgenda = async (eventId: string): Promise<Agenda> => {
  try {
    const response = await api.get(`/events/${eventId}/agenda/`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch event agenda. Please try again.');
  }
};

// Get agenda items for an event
export const getEventAgendaItems = async (eventId: string): Promise<AgendaItem[]> => {
  try {
    const response = await api.get(`/events/${eventId}/agenda/items/`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch event agenda items');
  }
};

// Get related events (excluding the current event)
export const getRelatedEvents = async (eventId: string, limit: number = 3): Promise<Event[]> => {
  try {
    // Use the dedicated endpoint for related events
    const response = await api.get(`/events/${eventId}/related/?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Failed to fetch related events');
  }
};
