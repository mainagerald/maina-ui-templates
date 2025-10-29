import React, { useState, ChangeEvent, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { EventCard } from '@/components/layouts/events/EventCard';
import { FeaturedEventCard } from '@/components/layouts/events/FeaturedEventCard';
import { EventCardSkeleton } from '@/components/layouts/events/EventCardSkeleton';
import { getAllEvents, getFeaturedEvents, Event } from '@/services/eventService';

// Define event types for filtering
const EVENT_TYPES = ['All Types', 'Workshop', 'Webinar', 'Conference', 'Meetup', 'Hackathon', 'Panel Discussion'];


// Main EventsPage Component
const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [useSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Filter events based on search term and selected type
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All Types' || event.type === selectedType;
    return matchesSearch && matchesType;
  });
  
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };
  
  // Featured event is either from the featured endpoint or the first event
  const featuredEvent = featuredEvents.length > 0 ? featuredEvents[0] : (events.length > 0 ? events[0] : null);
  
  useEffect(() => {
    // Fetch events data from the backend
    const fetchEvents = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const allEvents = await getAllEvents();
        setEvents(allEvents);
        
        const featured = await getFeaturedEvents();
        setFeaturedEvents(featured);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'Failed to load events. Please try again.'
        );
        // Keep some events if we had them before an error
        if (events.length === 0 && featuredEvents.length === 0) {
          setEvents([]);
          setFeaturedEvents([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [retryCount]);
   // Refetch when retryCount changes

  return (
    <main className="responsive-container mt-16">
      <div className="space-y-8 mt-20 mb-20">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${events.length < 1 && featuredEvents.length < 1 ? 'min-h-[100px]' : 'min-h-[20px]'} relative overflow-hidden bg-transparent`}
        >
          <div className="text-start">
            <p className="text-sm">Our events are crafted to engage and foster meaningful connections. <br/>Discover what's ahead!</p>
          </div>
        </motion.section>
        {!events.length && !featuredEvents.length && <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-[400px] relative overflow-hidden bg-transparent"
        >
          <div className="border border-red-500 flex items-center justify-center py-6 px-8 rounded-2xl max-w-[600px] mx-auto">
            <p className="text-sm text-red-500">No events available at the moment. Please check back later!</p>
          </div>
        </motion.section>}

        {/* Search and Filter */}
        {/* update when we have more data */}
        {useSearch && events.length > 0 && <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="relative">
            <input 
              type="search" 
              value={searchTerm} 
              onChange={handleSearchChange} 
              placeholder="Search events" 
              className="bg-card border border-border rounded-full py-2 pl-10 pr-4 text-sm text-muted-foreground"
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="flex items-center">
            <select 
              value={selectedType} 
              onChange={(e) => handleTypeChange(e.target.value)} 
              className="bg-card border border-border rounded-full py-2 pl-4 pr-10 text-sm text-muted-foreground"
            >
              {EVENT_TYPES.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>}

        {/* Error Message */}
        {error && !loading && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            <h3 className="font-semibold mb-2">Error Loading Events</h3>
            <p className="mb-3">{error}</p>
            <button
              onClick={() => setRetryCount(prev => prev + 1)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry Loading Events
            </button>
          </div>
        )}
        
        {/* Featured Event */}
        {loading ? (
          <div className="mb-8">
            <div className="rounded-2xl overflow-hidden bg-white">
              <div className="h-64 w-full">
                <div className="animate-pulse bg-gray-200 h-full w-full"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="animate-pulse bg-gray-200 h-6 w-1/4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-20 w-full rounded"></div>
                <div className="flex justify-between">
                  <div className="animate-pulse bg-gray-200 h-6 w-1/3 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-10 w-1/4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          featuredEvent && <FeaturedEventCard event={featuredEvent} />
        )}

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Display skeleton cards while loading
            Array(6).fill(0).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))
          ) : (
            filteredEvents.map((event: Event) => (
              <EventCard key={event.public_id} event={event} />
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default EventsPage;