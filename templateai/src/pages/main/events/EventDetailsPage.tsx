import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  MessageCircle,
  Linkedin,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/layouts/Skeleton";

import { getEventById, EventDetail, getRelatedEvents, Event } from "@/services/eventService";
import { isPast } from "@/util/PastDateCheck";

const EventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [relatedEventsLoading, setRelatedEventsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isPastEvent, setIsPastEvent] = useState(false);
  const relatedEventsRef = useRef<HTMLElement | null>(null);

  // Function to fetch related events lazily
  const fetchRelatedEvents = async () => {
    if (!id || relatedEventsLoading || relatedEvents.length > 0) return;
    
    try {
      setRelatedEventsLoading(true);
      // Use the optimized endpoint that only fetches what we need
      const related = await getRelatedEvents(id, 3);
      setRelatedEvents(related);
    } catch (err) {
      console.error('Error fetching related events:', err);
      // We don't set the main error state here to avoid disrupting the main content
    } finally {
      setRelatedEventsLoading(false);
    }
  };

  // Set up Intersection Observer for lazy loading related events
  useEffect(() => {
    if (!relatedEventsRef.current || !id || relatedEvents.length > 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchRelatedEvents();
          observer.disconnect(); // Only need to fetch once
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );
    
    observer.observe(relatedEventsRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [id, relatedEvents.length]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const eventData = await getEventById(id);
        setEvent(eventData);
        setIsPastEvent(isPast(eventData.date));
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);


  if (loading) {
    return (
      <div className="responsive-container mt-24 flex flex-col space-y-8 min-h-[80vh] px-4">
        {/* Back button skeleton */}
        <div className="mt-16">
          <Skeleton variant="text" width="120px" />
        </div>

        {/* Hero section skeleton */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="h-80 md:h-96 w-full">
            <Skeleton height="100%" width="100%" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <Skeleton variant="text" width="120px" className="mb-4" />
              <Skeleton
                variant="text"
                width="70%"
                height="40px"
                className="mb-4"
              />

              <div className="flex flex-wrap gap-6 mt-4">
                <Skeleton variant="text" width="120px" />
                <Skeleton variant="text" width="120px" />
                <Skeleton variant="text" width="120px" />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-3">
            <Skeleton
              variant="rectangular"
              width="150px"
              height="48px"
              className="rounded-full"
            />
            <Skeleton
              variant="rectangular"
              width="120px"
              height="48px"
              className="rounded-full"
            />
          </div>

          <Skeleton variant="text" width="100px" />
        </div>

        {/* Tabs skeleton */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            <Skeleton variant="text" width="100px" height="30px" />
            <Skeleton variant="text" width="100px" height="30px" />
            <Skeleton variant="text" width="100px" height="30px" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          <Skeleton variant="text" width="100%" height="100px" />
          <Skeleton variant="text" width="100%" height="200px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="responsive-container mt-24 text-center min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-4">Error Loading Event</h1>
        <p className="text-gray-600 mb-8 text-sm">{error}</p>
        <Link
          to="/events"
          className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="responsive-container mt-24 text-center min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-8 text-sm">The event you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/events"
          className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-all duration-200"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <main className="responsive-container mt-16">
      <div className="space-y-8 mt-20 mb-20">
        {/* Back Button */}
        <div className="mt-16 p-10 pb-3">
          <Link to="/events" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors rounded-full border px-3 py-1">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Events
          </Link>
        </div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden bg-transparent"
        >
          <div className="h-80 md:h-96 w-full relative">
            <img
              src={event.imageUrl || event.image 
                || 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=2070&auto=format&fit=crop'
                }
              alt={event.title}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="rounded-2xl absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
              <div className="inline-block bg-red-600 px-2 py-1 rounded-full text-sm font-medium mb-4 shadow-lg">
                {event.type}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-light" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-light" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-light" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary-light" />
                  <span>{event.registrations_count} attendees</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          {isPastEvent ? (
            <div className="flex gap-3">
              <button
                className="bg-gray-100 hover:cursor-not-allowed text-gray-400 px-6 py-3 rounded-full disabled:opacity-50 transition-colors shadow-sm font-medium"
                onClick={() => {}}
                type="button"
                disabled
              >
                Register Now
              </button>
              <button
                className="border border-gray-700 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors shadow-sm hover:shadow flex items-center"
                onClick={() => {}}
                type="button"
                
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-sm hover:shadow font-medium"
                onClick={() => {}}
                type="button"
              >
                Register Now
              </button>
              <button
                className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm hover:shadow flex items-center"
                onClick={() => {}}
                type="button"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
            </div>
          )}

        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("agenda")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "agenda"
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Agenda
            </button>
            <button
              onClick={() => setActiveTab("speakers")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "speakers"
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Speakers
            </button>
            <button
              onClick={() => setActiveTab("attendees")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "attendees"
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Attendees
            </button>
            {/* <button
              onClick={() => setActiveTab("discussion")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "discussion"
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Discussion
            </button> */}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">{event.description}</p>
                  <p className="mb-4">
                    Join us for the biggest AI event in East Africa, featuring
                    keynotes from industry leaders, interactive workshops, and
                    unparalleled networking opportunities. This three-day
                    conference will bring together researchers, practitioners,
                    and enthusiasts from across the continent to explore the
                    latest advances in artificial intelligence and their
                    applications in African contexts.
                  </p>
                  <p>
                    Whether you're a seasoned AI professional or just beginning
                    your journey in the field, the Annual TEMPLATE Conference
                    offers valuable insights, hands-on learning experiences, and
                    connections that will help you advance your knowledge and
                    career.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">{isPastEvent ? "What Was Learned" : "What You'll Learn"}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Latest advancements in large language models and their applications",
                    "Ethical considerations in AI development for African contexts",
                    "Practical techniques for building and deploying AI solutions",
                    "Strategies for addressing data challenges in emerging markets",
                    "Opportunities for AI entrepreneurship in East Africa",
                    "Best practices for responsible AI implementation",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <svg
                          className="h-4 w-4 text-primary"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Date
                      </dt>
                      <dd className="mt-1 text-gray-900">{event.date}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Time
                      </dt>
                      <dd className="mt-1 text-gray-900">{event.time}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Location
                      </dt>
                      <dd className="mt-1 text-gray-900">{event.location}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Event Type
                      </dt>
                      <dd className="mt-1 text-gray-900">{event.type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Organizer
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        TEMPLATE
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Language
                      </dt>
                      <dd className="mt-1 text-gray-900">English</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "agenda" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Event Agenda</h2>
              {event.agenda && event.agenda.items && event.agenda.items.length > 0 ? (
                <div className="space-y-6">
                  {event.agenda.items.map((item) => (
                    <div
                      key={item.public_id}
                      className="relative pl-8 pb-8 border-l-2 border-green-200 last:border-0 last:pb-0"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-0 -translate-x-1/2 h-4 w-4 rounded-full bg-green-500 border-4 border-green-100"></div>

                      <div className="bg-transparent p-6 rounded-xl ml-4">
                        <div className="text-sm font-medium text-gray-500 mb-2">
                          {item.time}
                        </div>
                        <h3 className="text-lg mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-600 mb-2">{item.description}</p>
                        )}
                        {item.speaker_name && (
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">Speaker:</span>{" "}
                            {item.speaker_name}
                            {item.speaker_role && ` (${item.speaker_role})`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No agenda has been published for this event yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "speakers" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Event Speakers</h2>
              {event.speakers && event.speakers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {event.speakers.map((speaker) => (
                    <div
                      key={speaker.public_id}
                      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-w-16 h-96 bg-gray-100">
                        <img
                          src={speaker.imageUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop'}
                          alt={speaker.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                        <p className="text-primary text-sm font-medium mb-3">
                          {speaker.role}
                        </p>
                        {speaker.linkedinUrl && (
                          <a
                            href={speaker.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Linkedin className="h-4 w-4 mr-1" />
                            <span className="text-sm">LinkedIn Profile</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No speakers have been announced for this event yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "attendees" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Attendees ({event.registrations ? event.registrations.length : 0})
                </h2>
                <p className="text-gray-500">
                  Showing {event.registrations ? event.registrations.length : 0} of {event.registrations_count} attendees
                </p>
              </div>

              {event.registrations && event.registrations.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {event.registrations.map((registration) => (
                      <div key={registration.public_id} className="text-center">
                        <div className="h-12 w-12 md:h-20 md:w-20 mx-auto rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {/* Use a placeholder avatar since we don't have attendee images */}
                          <span className="text-gray-500 text-xl font-bold">
                            {registration.attendee.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-medium truncate">
                          {registration.attendee.username}
                        </p>
                      </div>
                    ))}
                  </div>

                  {event.registrations_count > event.registrations.length && (
                    <div className="mt-8 text-center">
                      <button className="text-primary font-medium hover:underline">
                        View All Attendees
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No attendees have registered for this event yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "discussion" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Discussion</h2>
                <p className="text-gray-500">
                  0 comments
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl mb-6">
                <h3 className="font-medium mb-4">Add a comment</h3>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={4}
                  placeholder="Share your thoughts about this event..."
                ></textarea>
                <div className="flex justify-end mt-4">
                  <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    Post Comment
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Recent Comments</h3>
                  <div className="flex space-x-2">
                    <button className="p-1 rounded hover:bg-gray-100">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Placeholder for comments */}
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Related Events */}
        <section className="mt-16 bg-transparent" ref={relatedEventsRef}>
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEventsLoading ? (
              // Loading state for related events
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-transparent rounded-xl overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
                  <div className="h-58 overflow-hidden relative rounded-xl bg-gray-200 animate-pulse"></div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
                    <div className="mt-auto h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                  </div>
                </div>
              ))
            ) : relatedEvents.length > 0 ? (
              relatedEvents.map((relatedEvent) => (
                <div
                  key={relatedEvent.public_id}
                  className="bg-transparent rounded-xl overflow-hidden transition-all hover:shadow-md flex flex-col h-full"
                >
                  <div className="h-58 overflow-hidden relative rounded-xl">
                    <img
                      src={relatedEvent.imageUrl || relatedEvent.image || 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=2070&auto=format&fit=crop'}
                      alt={relatedEvent.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {relatedEvent.type}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold">
                      {relatedEvent.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedEvent.description}
                    </p>

                    <div className="mt-auto">
                      <Link
                        to={`/events/${relatedEvent.public_id}`}
                        className="inline-flex items-center text-primary font-medium hover:underline"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">No related events found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default EventDetailsPage;
