// Event types for the application

export enum EventType {
  WORKSHOP = 'workshop',
  CONFERENCE = 'conference',
  MEETUP = 'meetup',
  WEBINAR = 'webinar',
  HACKATHON = 'hackathon',
  OTHER = 'other'
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PUBLISHED = 'published',
  DRAFT = 'draft'
}

export interface Speaker {
  public_id?: string; // Optional for frontend compatibility
  name: string;
  role: string;
  bio?: string; // Added for frontend compatibility
  linkedinUrl?: string | null;
  imageUrl?: string | null;
  created_at?: string; // Optional for frontend compatibility
  updated_at?: string; // Optional for frontend compatibility
}

export interface AgendaItem {
  public_id?: string; // Optional for frontend compatibility
  time: string;
  title: string;
  description?: string | null;
  speaker?: Speaker | string | null; // Allow string for frontend compatibility
  created_at?: string; // Optional for frontend compatibility
  updated_at?: string; // Optional for frontend compatibility
}

export interface Registration {
  public_id: string;
  attendee: {
    public_id: string;
    username: string;
    email: string;
  };
  registration_date: string;
  attended: boolean;
  updated_at: string;
}

export interface Event {
  public_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  end_date: string | null;
  location: string;
  type: string;
  image: File | null;
  imageUrl: string | null;
  organizer: {
    public_id: string;
    username: string;
    email: string;
  };
  max_attendees: number | null;
  registration_required: boolean;
  registration_deadline: string | null;
  is_featured: boolean;
  status: EventStatus | string; // Using EventStatus enum but allowing string for compatibility
  created_at: string;
  updated_at: string;
  registrations_count: number;
  registrations: Registration[];
  is_registered?: boolean;
  speakers: Speaker[];
  agenda: AgendaItem[] | null;
}

export interface EventMetrics {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalRegistrations: number;
  averageAttendance: number;
  eventsByType: {
    name: string;
    value: number;
  }[];
  registrationsByMonth: {
    name: string;
    value: number;
  }[];
  topEvents: {
    name: string;
    registrations: number;
  }[];
}
