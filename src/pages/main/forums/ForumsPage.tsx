// React is automatically imported by JSX transform
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusCircle,
  Search as SearchIcon,
  Loader2,
  X,
  Send
} from 'lucide-react';
import { getAllThreads, Thread, createThread } from '@/services/forumService';
import { showSuccessToast, showErrorToast } from '@/components/layouts/toast/miniToast';

// Categories from backend
const categories = [
  { id: 1, name: 'General', threads: 0 },
  { id: 2, name: 'Research', threads: 0 },
  { id: 3, name: 'Announcements', threads: 0 },
  { id: 4, name: 'Projects', threads: 0 },
  { id: 5, name: 'Jobs & Internships', threads: 0 },
  { id: 6, name: 'Collaboration', threads: 0 }
];

// Category Sidebar Component
const CategorySidebar = ({ current, onSelect }: { current: string; onSelect: (cat: string) => void }) => (
  <aside className="hidden lg:block w-72 pr-6 border-gray-100 sticky top-20 self-start h-screen overflow-y-auto pb-20 font-sans">
    <h2 className="text-sm font-semibold text-gray-900 mb-4">Categories</h2>
    <ul className="space-y-1">
      <li>
        <button
          className={`flex justify-between items-center w-full px-3 py-2 rounded-md text-left transition-colors ${
            current === 'All' ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
          }`}
          onClick={() => onSelect('All')}
        >
          <span>All threads</span>
        </button>
      </li>
      {categories.map((cat) => (
        <li key={cat.id}>
          <button
            className={`flex justify-between items-center w-full px-3 py-2 rounded-md text-left transition-colors ${
              current === cat.name ? 'bg-gray-100 font-medium' : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelect(cat.name)}
          >
            <span>{cat.name}</span>
            <span className="text-xs text-gray-500">{cat.threads}</span>
          </button>
        </li>
      ))}
    </ul>
  </aside>
);

// Mobile Category Dropdown
const MobileCategoryDropdown = ({ current, onSelect }: { current: string; onSelect: (cat: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (category: string) => {
    onSelect(category);
    setIsOpen(false);
  };
  
  return (
    <div className="lg:hidden relative w-full">
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between lowercase w-48 px-3 py-1 bg-gray-50 border border-gray-200 rounded-3xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <span>{current === 'All' ? 'All threads' : current}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 w-48 mt-1 bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden"
        >
          <button
            className={`w-full px-4 py-2.5 text-left text-sm lowercase hover:bg-gray-50 transition-colors ${
              current === 'All' ? 'bg-gray-100 font-medium' : ''
            }`}
            onClick={() => handleSelect('All')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 text-left text-sm lowercase hover:bg-gray-50 transition-colors ${
                current === cat.name ? 'bg-gray-100 font-medium' : ''
              }`}
              onClick={() => handleSelect(cat.name)}
            >
              <div className="w-48 flex items-center">
                <span>{cat.name}</span>
                <span className="text-xs text-gray-500 bg-gray-200 rounded-full h-5 w-5 flex items-center justify-center ml-3">{cat.threads}</span>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Import the reusable ThreadCard component
import { ThreadCard } from '@/components/layouts/thread';

const ForumsPage = () => {
  // const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('General');
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);

  // Fetch threads from API
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const data = await getAllThreads(selectedCategory !== 'All' ? selectedCategory : undefined);
        setThreads(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching threads:', err);
        setError('Failed to load threads. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [selectedCategory]);

  // Create new thread
  const handleCreateThread = async () => {
    if (!newThreadContent.trim()) return;
    
    try {
      setIsCreatingThread(true);
      const newThread = await createThread({
        content: newThreadContent,
        category: newThreadCategory,
        tags: []
      });

      // Add the new thread to the list
      setThreads(prevThreads => [newThread, ...prevThreads]);
      
      // Reset form
      setNewThreadContent('');
      setShowNewThreadForm(false);
      
      // Show success notification
      showSuccessToast('Thread created successfully');
    } catch (err) {
      console.error('Error creating thread:', err);
      setError('Failed to create thread. Please try again.');
      
      // Show error notification
      showErrorToast('Failed to create thread');
    } finally {
      setIsCreatingThread(false);
    }
  };

  // Filter threads based on search query
  const filteredThreads = threads.filter(thread => {
    const content = thread.title || thread.content;
    return content.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col lg:flex-row gap-0 mt-20 pt-6 sm:pt-10 font-sans w-full px-4 sm:px-6 md:px-10 pb-10">
      {/* Sidebar - Desktop only */}
      <CategorySidebar current={selectedCategory} onSelect={setSelectedCategory} />

      {/* Main content */}
      <section className="flex-1 border-gray-100 w-full bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between px-1 sm:px-5 py-3 border-gray-100">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-black font-sora">Forums</h1>
          </div>

          <motion.button 
            onClick={() => setShowNewThreadForm(true)}
            className="inline-flex items-center gap-1 sm:gap-1.5 bg-black text-white px-3 sm:px-4 py-1.5 rounded-full hover:bg-gray-800 transition-colors text-xs sm:text-sm font-medium"
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle className="w-3 h-3 sm:w-4 sm:h-4" /> 
            <span className="hidden xs:inline">New Thread</span>
            <span className="xs:hidden">New</span>
          </motion.button>
        </div>

        {showNewThreadForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-5 rounded-2xl shadow-sm mb-6 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-medium text-gray-900">create a new thread</h2>
              <button
                onClick={() => setShowNewThreadForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <textarea
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-4 bg-gray-50 border-0 rounded-xl mb-4 focus:outline-none focus:ring-1 focus:ring-gray-200 text-gray-800 placeholder-gray-400 resize-none"
              rows={4}
              autoFocus
            />
            
            <div className="flex flex-wrap gap-3 mb-4">
              {['General', 'Research', 'Announcements', 'Projects', 'Jobs & Internships', 'Collaboration'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setNewThreadCategory(tag)}
                  className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                    newThreadCategory === tag 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleCreateThread}
                disabled={!newThreadContent.trim() || isCreatingThread}
                className="px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-colors"
              >
                {isCreatingThread ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Post Thread
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Mobile category filter */}
        <div className="lg:hidden mb-4 mt-2">
          <MobileCategoryDropdown current={selectedCategory} onSelect={setSelectedCategory} />
        </div>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search threads..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-300 border-0 border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-transparent transition-all"
          />
        </div>
        
        {/* Thread list */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading threads...</span>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-blue-500 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No threads found</p>
              {query && (
                <button 
                  onClick={() => setQuery('')} 
                  className="mt-2 text-blue-500 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <ThreadCard key={thread.public_id} thread={thread} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ForumsPage;
