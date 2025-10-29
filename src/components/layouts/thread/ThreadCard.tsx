import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Eye, Bookmark, ArrowRight, MoreHorizontal, Flame, Pencil, Trash2, Flag, Pin, UserCircle, Share, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Thread } from '../../../services/forumService';
import { useAuth } from '../../../auth/AuthContext';
import { showSuccessToast } from '../../../components/layouts/toast/miniToast';
import useShareThread from '@/hooks/useShareThread';

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const {shareThread} = useShareThread();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleNavigateToThread = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/forums/thread/${thread.public_id}`);
  };
  
  const isAuthor = () => {
    if (!user) return false;
    return thread.author.public_id === user.public_id;
  };
  
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(prevState => !prevState);
  };
  
  const handleEditThread = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/forums/thread/${thread.public_id}/edit`);
    setShowMenu(false);
  };
  
  const handleDeleteThread = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/forums/thread/${thread.public_id}`);
    setShowMenu(false);
  };
  
  const handlePinToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    showSuccessToast('Thread pinned to your profile');
    setShowMenu(false);
  };
  
  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${thread.author.public_id}`);
    setShowMenu(false);
  };
  
  // Handle flag post
  const handleFlagPost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFlagModal(true);
    setShowMenu(false);
  };
  
  // Handle submit flag
  const handleSubmitFlag = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // API to flag the thread
    showSuccessToast('Post has been flagged');
    setFlagReason('');
    setShowFlagModal(false);
  };
  
  const handleAuthorProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${thread.author.public_id}`);
  };
  
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      className="mb-3 bg-white px-4 sm:px-5 py-3 sm:py-4 flex flex-col gap-2 sm:gap-3 hover:bg-gray-100 rounded-2xl sm:rounded-3xl hover:shadow-sm transition-colors duration-200"
      onClick={(e) => handleNavigateToThread(e)}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <img 
          src={`https://ui-avatars.com/api/?name=${thread.author.username}&background=random`} 
          alt={thread.author.username} 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover cursor-pointer" 
          onClick={handleAuthorProfileClick}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span 
                className="font-semibold text-xs sm:text-sm text-black cursor-pointer" 
                onClick={handleAuthorProfileClick}
              >
                {thread.author.username}
              </span>
              <span className="text-xs text-gray-500">· {formatDistanceToNow(new Date(thread.created_at))} ago</span>
            </div>
            <div className="relative">
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={toggleMenu}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              {showMenu && (
                <div 
                  ref={menuRef}
                  className="absolute right-0 top-6 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isAuthor() ? (
                    // Author options
                    <>
                      <button 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleEditThread}
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handlePinToProfile}
                      >
                        <Pin className="w-4 h-4" /> Pin to profile
                      </button>
                      <button 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={handleDeleteThread}
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </>
                  ) : (
                    // Non-author options
                    <>
                      <button 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleViewProfile}
                      >
                        <UserCircle className="w-4 h-4" /> View profile
                      </button>
                      <button 
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={handleFlagPost}
                      >
                        <Flag className="w-4 h-4" /> Flag post
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <h3 className="font-light text-sm sm:text-base leading-snug mt-1 text-black">
            {thread.title || thread.content.substring(0, 100)}
            {thread.content.length > 100 && '...'}
          </h3>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
            {thread.tags && thread.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                #{tag.replace(/ /g, '')}
              </span>
            ))}
            {thread.is_pinned && (
              <span className="inline-flex items-center gap-0.5 text-xs text-gray-900 font-medium">
                <Flame className="w-3 h-3 text-orange-500" /> Pinned
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-0.5 sm:mt-1 text-gray-500">
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type='button'
            onClick={(e) => handleNavigateToThread(e)}
            className="flex items-center gap-1 sm:gap-1.5 hover:text-black transition-colors"
          >
            <MessageCircle className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> 
            <span className="text-xs">{thread.comments_count}</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-1.5 hover:text-black transition-colors">
            <Eye className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="text-xs">{thread.views}</span>
          </button>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <button className="hover:text-black transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            shareThread(thread, e);
          }}>
            <Share2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
          <button 
            onClick={(e) => handleNavigateToThread(e)}
            className="hover:text-black transition-colors"
          >
            <ArrowRight className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>
      
      {/* Flag Modal */}
      {showFlagModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation();
            setShowFlagModal(false);
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Flag this post</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFlagModal(false);
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmitFlag}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for flagging</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  placeholder="Please provide details about why you're flagging this post..."
                  required
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFlagModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
                >
                  Submit Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ThreadCard;
