import { showErrorToast, showSuccessToast } from "@/components/layouts/toast/miniToast";
import { useCallback } from "react";
import { Thread } from "../services/forumService";

const useShareThread = () => {
    const shareThread = useCallback(async (thread: Thread, e?: React.MouseEvent) => {
      e?.stopPropagation();
      
      const shareUrl = `${window.location.origin}/forums/thread/${thread.public_id}`;
      const shareData = {
        title: thread.title || 'Thread from TEMPLATE',
        text: `Check out this thread: ${thread.content.substring(0, 100)}${thread.content.length > 100 ? '...' : ''}`,
        url: shareUrl,
      };
      
      try {
        // Check if Web Share API is supported and can share this content
        if (navigator.share && navigator.canShare?.(shareData)) {
          await navigator.share(shareData);
          showSuccessToast('Thread shared successfully');
          return;
        }
        
        // Modern clipboard fallback
        await navigator.clipboard.writeText(shareUrl);
        showSuccessToast('Link copied to clipboard');
        
      } catch (error) {
        console.error('Share operation failed:', error);
        
        // Legacy fallback for older browsers
        try {
          const textarea = document.createElement('textarea');
          textarea.value = shareUrl;
          Object.assign(textarea.style, {
            position: 'fixed',
            left: '-999999px',
            top: '-999999px',
            opacity: '0',
          });
          
          document.body.appendChild(textarea);
          textarea.select();
          
          if (document.execCommand('copy')) {
            showSuccessToast('Link copied to clipboard');
          } else {
            throw new Error('Legacy copy failed');
          }
        } catch (legacyError) {
          console.error('All copy methods failed:', legacyError);
          showErrorToast('Unable to copy link. Please copy the URL manually.');
        } finally {
          const textarea = document.querySelector('textarea[style*="position: fixed"]');
          textarea?.remove();
        }
      }
    }, []);
    
    return { shareThread };
  };

  export default useShareThread;
