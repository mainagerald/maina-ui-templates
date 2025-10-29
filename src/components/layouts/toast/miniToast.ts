/**
 * Minimalistic toast notification system
 * Creates temporary DOM elements that auto-remove themselves
 * No permanent containers, no React dependencies
 */

// Toast options interface
interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

// Create a simple toast notification
const createToast = (message: string, type: 'success' | 'error' | 'info' | 'warning', options?: ToastOptions) => {
  // Default options
  const duration = options?.duration || 3000;
  const position = options?.position || 'top-right';
  
  // Create toast element
  const toast = document.createElement('div');
  
  // Set position styles
  toast.style.position = 'fixed';
  toast.style.zIndex = '9999';
  toast.style.padding = '10px 15px';
  toast.style.borderRadius = '4px';
  toast.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.16)';
  toast.style.fontSize = '14px';
  toast.style.fontFamily = 'sans-serif';
  toast.style.color = 'white';
  toast.style.minWidth = '200px';
  toast.style.maxWidth = '300px';
  toast.style.display = 'flex';
  toast.style.justifyContent = 'space-between';
  toast.style.alignItems = 'center';
  toast.style.transition = 'all 0.3s ease';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-20px)';
  
  // Set position based on option
  switch (position) {
    case 'top-right':
      toast.style.top = '5rem';
      toast.style.right = '5rem';
      break;
    case 'top-left':
      toast.style.top = '1rem';
      toast.style.left = '1rem';
      break;
    case 'bottom-right':
      toast.style.bottom = '1rem';
      toast.style.right = '1rem';
      break;
    case 'bottom-left':
      toast.style.bottom = '1rem';
      toast.style.left = '1rem';
      break;
  }
  
  // Set background color based on type
  switch (type) {
    case 'success':
      toast.style.backgroundColor = '#000000';
      break;
    case 'error':
      toast.style.backgroundColor = '#ef4444';
      break;
    case 'info':
      toast.style.backgroundColor = '#3b82f6';
      break;
    case 'warning':
      toast.style.backgroundColor = '#f59e0b';
      break;
  }
  
  // Create message element
  const messageEl = document.createElement('span');
  messageEl.textContent = message;
  toast.appendChild(messageEl);
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.fontSize = '16px';
  closeButton.style.marginLeft = '10px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '0 5px';
  toast.appendChild(closeButton);
  
  // Add to DOM
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  }, 10);
  
  // Close function
  const close = () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  };
  
  // Add close event
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    close();
  });
  
  // Auto close after duration
  setTimeout(close, duration);
  
  // Return close function
  return close;
};

// Success toast
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return createToast(message, 'success', options);
};

// Error toast
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return createToast(message, 'error', options);
};

// Info toast
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return createToast(message, 'info', options);
};

// Warning toast
export const showWarningToast = (message: string, options?: ToastOptions) => {
  return createToast(message, 'warning', options);
};
