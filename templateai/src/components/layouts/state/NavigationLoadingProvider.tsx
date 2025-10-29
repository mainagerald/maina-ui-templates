import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import LoadingFallback from './LoadingFallback';

interface NavigationLoadingContextType {
  isNavigating: boolean;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType>({
  isNavigating: false,
});

export const useNavigationLoading = () => useContext(NavigationLoadingContext);

interface NavigationLoadingProviderProps {
  children: React.ReactNode;
  minimumLoadingTime?: number; // Minimum time to show loading state in ms
}

export const NavigationLoadingProvider: React.FC<NavigationLoadingProviderProps> = ({
  children,
  minimumLoadingTime = 300, // Default minimum loading time
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Only show loading state for actual navigation events (not the initial load)
    if (navigationType !== 'POP' || document.readyState !== 'complete') {
      let timeoutId: NodeJS.Timeout;
      
      setIsNavigating(true);
      
      // Ensure loading state shows for at least minimumLoadingTime
      timeoutId = setTimeout(() => {
        setIsNavigating(false);
      }, minimumLoadingTime);
      
      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname, minimumLoadingTime, navigationType]);

  return (
    <NavigationLoadingContext.Provider value={{ isNavigating }}>
      {isNavigating && <LoadingFallback />}
      {children}
    </NavigationLoadingContext.Provider>
  );
};
