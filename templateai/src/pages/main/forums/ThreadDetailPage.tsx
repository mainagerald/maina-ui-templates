import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  ArrowLeft,
  User,
  Send,
  Bookmark,
  Share2,
  MoreHorizontal,
  Loader2,
  Pencil,
  Trash2,
  UserCircle,
  Flag,
  X
} from 'lucide-react';
import { getThreadById, createComment, updateThread, deleteThread, ThreadDetail, Comment } from '@/services/forumService';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/auth/AuthContext';
import { showSuccessToast, showErrorToast } from '@/components/layouts/toast/miniToast';

// Comment component
const CommentCard = ({ comment }: { comment: Comment }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="mb-4 last:mb-0"
  >
    <div className="flex items-start gap-3">
      <img
        src={`https://ui-avatars.com/api/?name=${comment.author.username}&background=random`}
        alt={comment.author.username}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm text-black">{comment.author.username}</span>
          <span className="text-xs text-gray-500">· {formatDistanceToNow(new Date(comment.created_at))} ago</span>
          {comment.is_author && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Author</span>
          )}
        </div>
        <div className="mt-1 text-sm text-gray-800">{comment.content}</div>
        <div className="mt-2 flex items-center gap-4 text-gray-500">
          <button className="text-xs hover:text-black transition-colors">Reply</button>
          <button className="text-xs hover:text-black transition-colors">Like</button>
        </div>
      </div>
    </div>
  </motion.div>
);

const ThreadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [thread, setThread] = useState<ThreadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside handler for dropdown menu
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

  // Fetch thread details
  useEffect(() => {
    const fetchThreadDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getThreadById(id);
        setThread(data);
        setEditContent(data.content); // Initialize edit content with current thread content
        setError(null);
      } catch (err) {
        console.error('Error fetching thread details:', err);
        setError('Failed to load thread details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchThreadDetails();
  }, [id]);

  // Handle thread edit
  const handleEditThread = async () => {
    if (!id || !editContent.trim() || !thread) return;
    
    try {
      setIsEditing(true);
      const updatedThread = await updateThread(id, { content: editContent });
      
      // Update the thread with the edited content
      setThread({
        ...thread,
        content: updatedThread.content,
        updated_at: updatedThread.updated_at
      });
      
      // Exit edit mode
      setIsEditing(false);
      setShowMenu(false);
      
      // Show success notification
      showSuccessToast('Thread updated successfully');
    } catch (err) {
      console.error('Error updating thread:', err);
      showErrorToast('Failed to update thread');
    }
  };

  // Handle thread delete
  const handleDeleteThread = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await deleteThread(id);
      
      // Show success notification
      showSuccessToast('Thread deleted successfully');
      
      // Navigate back to forums page after deletion
      navigate('/forums');
    } catch (err) {
      console.error('Error deleting thread:', err);
      showErrorToast('Failed to delete thread');
      setIsDeleting(false);
    }
  };

  // Handle view profile
  const handleViewProfile = () => {
    if (!thread) return;
    
    // Navigate to the author's profile page
    navigate(`/profile/${thread.author.public_id}`);
    setShowMenu(false);
  };

  // Toggle dropdown menu
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(prevState => !prevState);
  };

  // Check if current user is the author of the thread
  const isAuthor = () => {
    if (!thread || !user) return false;
    return thread.author.public_id === user.public_id;
  };


  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!id || !newComment.trim()) return;
    
    try {
      setIsSubmittingComment(true);
      const comment = await createComment(id, newComment);
      
      // Update the thread with the new comment
      if (thread) {
        setThread({
          ...thread,
          comments_count: thread.comments_count + 1,
          comments: {
            ...thread.comments,
            results: [comment, ...thread.comments.results]
          }
        });
      }
      
      // Clear the comment input
      setNewComment('');
      
      // Show success notification
      showSuccessToast('Comment posted successfully');
    } catch (err) {
      console.error('Error creating comment:', err);
      showErrorToast('Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/forums');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center mt-20">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
          <p className="mt-4 text-gray-500">Loading thread...</p>
        </div>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen flex justify-center items-center mt-20">
        <div className="text-center">
          <p className="text-red-500">{error || 'Thread not found'}</p>
          <button 
            onClick={handleBack} 
            className="mt-4 inline-flex items-center gap-2 text-blue-500 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Forum
          </button>
        </div>
      </div>
    );
  }

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Delete Thread</h3>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Are you sure you want to delete this thread?</p>
          <p className="text-sm text-red-500">This action cannot be undone.</p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleDeleteThread();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-gray-900 mt-20 pt-6 sm:pt-10 font-sans w-full px-4 sm:px-6 md:px-10 pb-10">
      <AnimatePresence>
        {showDeleteModal && <DeleteConfirmationModal />}
      </AnimatePresence>
      <div className="max-w-3xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="inline-flex lowercase text-sm items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4 " /> Forum
          </button>
        </div>

        {/* Thread content */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            {/* Author info */}
            <div className="flex items-center gap-3 mb-4 hover:cursor-pointer"
            onClick={handleViewProfile}>
              <img 
                src={`https://ui-avatars.com/api/?name=${thread.author.username}&background=random`} 
                alt={thread.author.username} 
                className="w-10 h-10 rounded-full object-cover" 
              />
              <div>
                <div className="font-medium text-black hover:cursor-pointer" onClick={handleViewProfile}>{thread.author.username}</div>
                <div className="text-xs text-gray-500">{formatDistanceToNow(new Date(thread.created_at))} ago</div>
              </div>
              <div className="ml-auto relative">
                <button
                  type='button'
                  onClick={(e) => toggleMenu(e)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showMenu && (
                    <motion.div 
                      ref={menuRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-10 overflow-hidden border border-gray-100"
                    >
                      <div className="py-1">
                        {isAuthor() ? (
                          <>
                            <button
                            type='button'
                              onClick={() => {
                                setIsEditing(true);
                                setShowMenu(false);
                              }}
                              className="lowercase flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              disabled={isEditing || isDeleting}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                            <button
                            type='button'
                              onClick={() => {
                                setShowDeleteModal(true);
                                setShowMenu(false);
                              }}
                              className="lowercase flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              disabled={isEditing || isDeleting}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                            type='button'
                              onClick={handleViewProfile}
                              className="lowercase flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <UserCircle className="w-4 h-4 mr-2" />
                              View Profile
                            </button>
                            <button
                            type='button'
                              onClick={() => {
                                alert('Report submitted. Thank you for helping keep our community safe.');
                                setShowMenu(false);
                              }}
                              className="lowercase flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Flag className="w-4 h-4 mr-2" />
                              Report Thread
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Thread content - Edit mode or display mode */}
            {isEditing ? (
              <div className="mb-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 text-base sm:text-lg bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={5}
                />
                <div className="flex justify-end mt-3 space-x-2">
                  <button
                  type='button'
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(thread.content); // Reset content
                    }}
                    className="lowercase px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <X className="w-3 h-3 mr-1" /> Cancel
                  </button>
                  <button
                  type='button'
                    onClick={handleEditThread}
                    className="lowercase px-4 py-2 text-sm text-white bg-black rounded-lg hover:bg-gray-900 transition-colors flex items-center"
                  >
                    <Pencil className="w-3 h-3 mr-1" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-900 text-base sm:text-lg mb-4">
                {thread.content}
              </div>
            )}

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full"
                  >
                    #{tag.replace(/ /g, '')}
                  </span>
                ))}
              </div>
            )}

            {/* Thread stats and actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" /> 
                  <span className="text-xs">{thread.comments_count} comments</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* <button className="hover:text-black transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button> */}
                <button className="hover:text-black transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comment form */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-0 border-gray-100 p-4 sm:p-6 mb-6">
          <h2 className="text-sm font-medium mb-4">add comment</h2>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                className="w-full text-sm p-3 bg-gray-200 border-0 border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="lowercase inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmittingComment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border-0 border-gray-100 p-4 sm:p-6">
          <h2 className="text-sm font-medium mb-4">comments ({thread.comments_count})</h2>
          
          {thread.comments.results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {thread.comments.results.map((comment) => (
                <CommentCard key={comment.public_id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ThreadDetailPage;
