import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  Calendar,
  BookOpen,
  FolderGit2,
  MessageSquare,
  Briefcase,
  LogIn,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import logoImage from "../../assets/TEMPLATEAI_Logo_HighRes.png";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setCurrentPage, setPageTheme, PageTheme } from '../../store/navigationSlice';
import { useAuth } from '../../auth';

interface NavLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
  scrolled?: boolean;
}

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPage, pageTheme } = useSelector((state: RootState) => state.navigation);
  const { isAuthenticated, user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { to: "/events", label: "Events", icon: <Calendar className="h-4 w-4 mr-3 text-purple-800" /> },
    { to: "/forums", label: "Forum", icon: <MessageSquare className="h-4 w-4 mr-3 text-purple-800" /> },
    { to: "/resources", label: "Resources", icon: <BookOpen className="h-4 w-4 mr-3 text-purple-800" /> },
    { to: "/projects", label: "Projects", icon: <FolderGit2 className="h-4 w-4 mr-3 text-purple-800" /> },
    { to: "/about", label: "About", icon: <BookOpen className="h-4 w-4 mr-3 text-purple-800" /> },
  ];

  // Dynamically create mobile nav items based on authentication status
  const navItemsMobile: NavItem[] = [
    { to: "/events", label: "Events", icon: <Calendar className="h-4 w-4 mr-3 text-purple-800" /> },
    { to: "/forums", label: "Forum", icon: <MessageSquare className="h-4 w-4 mr-3 text-purple-800" /> },
    { to: "/resources", label: "Resources", icon: <BookOpen className="h-4 w-4 mr-3 text-purple-800" /> },
    { to: "/projects", label: "Projects", icon: <FolderGit2 className="h-4 w-4 mr-3 text-purple-800" /> },
    { to: "/about", label: "About", icon: <BookOpen className="h-4 w-4 mr-3 text-purple-800" /> },
  ];

  useEffect(() => {
    // Add scroll listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMenuOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update Redux state when location changes
  useEffect(() => {
    dispatch(setCurrentPage(location.pathname));
    
    // Set page theme based on current page
    if (location.pathname === '/about') {
      dispatch(setPageTheme('dark'));
    } else if (location.pathname === '/') {
      dispatch(setPageTheme('transparent'));
    } else {
      dispatch(setPageTheme('light'));
    }
  }, [location, dispatch]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  
  const handleLogout = async () => {
    try {
      // Show loading state if needed
      // Call the async logout function
      await logout();
      // Navigate to home page after successful logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Close the user menu regardless of logout success/failure
      setIsUserMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-4 left-0 right-0 mx-auto max-w-[95%] md:max-w-[90%] z-50 transition-all duration-300 rounded-full",
        scrolled ? "py-3 backdrop-blur-md bg-white/20 shadow-lg" : "py-4 bg-white/10 backdrop-blur-[10px]",
        pageTheme === 'dark' ? "text-white" : "text-gray-800",
        pageTheme === 'dark' && !scrolled && "bg-black/20"
      )}
    >
      <div className="px-6 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center space-x-4 md:mr-3 sm:mr-2"
        >


          <Link to="/" className={cn(
            "font-extrabold lowercase text-lg font-bold tracking-tight flex flex-row items-center rounded-full px-2 py-0.5 border",
            // Apply different styles based on page theme
            pageTheme === 'dark' ? 
              "bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 border-white/30" : 
              "bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-purple-700 to-red-700 border-gradient-to-r from-blue-900 via-purple-700 to-red-700",
            // Add white glow effect on dark backgrounds
            pageTheme === 'dark' && "border"
          )}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              TEMPLATE.
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              AI
            </motion.span>
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-8 md:space-x-5 md:text-sm">
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              scrolled={scrolled}
              className={currentPage === item.to ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-base px-2 py-1 rounded-full font-medium bg-black hover:bg-black/90 text-white transition-all duration-300"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline md:inline md:text-sm sm:text-sm">{user?.username || 'account'}</span>
                <ChevronDown className="h-4 w-4" />
              </motion.button>
              
              {/* User dropdown menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50 border border-gray-100"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link
                to="/login"
                className="group relative overflow-hidden text-base px-8 py-4 md:px-4 md:py-2 rounded-full font-medium bg-black hover:bg-black/90 text-white transition-all duration-300"
              >
                Sign In
              </Link>
            </motion.div>
          )}
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="p-2 rounded-full text-blue-500 hover:bg-blue-50"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-black" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay with Framer Motion */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed z-50 bg-white h-screen w-[100vw] top-0 right-0 left-0 overflow-y-auto p-0 m-0"
          >
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full flex flex-col p-6"
            >
              {/* First div: App name and close button */}
              <div className="flex items-center justify-between mb-4">
                <Link to="/" className={cn(
                  "font-extrabold lowercase text-lg font-bold tracking-tight flex flex-row items-center",
                  "bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-purple-700 to-red-700"
                )}>
                  <span>TEMPLATE.AI</span>
                </Link>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMenu}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="h-8 w-8 text-black" />
                </motion.button>
              </div>
              
              {/* Second div: Navigation and action buttons */}
              <div className="flex flex-col flex-1 justify-between">
                {/* Navigation section */}
                <nav className="flex flex-col text-base text-purple-800">
                  {navItemsMobile.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <MobileNavLink to={item.to} onClick={toggleMenu}>
                        {item.icon}
                        {item.label}
                      </MobileNavLink>
                    </motion.div>
                  ))}
                </nav>
                
                {/* Action buttons section */}
                <div className="mt-8 pt-2 border-t border-gray-100">
                  {isAuthenticated ? (
                    <div className="flex flex-col space-y-2">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          to="/profile"
                          className="flex items-center w-full px-4 py-2 transition-all duration-300 bg-black hover:bg-black/90 rounded-3xl text-white"
                          onClick={toggleMenu}
                        >
                          <User className="h-5 w-5 mr-2 text-white" />
                          Profile
                        </Link>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <button
                          onClick={() => {
                            handleLogout();
                            toggleMenu();
                          }}
                          className="flex items-center w-full px-4 py-1.5 transition-all duration-300 bg-white hover:bg-black/90 rounded-3xl text-black border border-black"
                        >
                          <LogOut className="h-5 w-5 mr-2 text-black" />
                          Logout
                        </button>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          to="/login"
                          className="flex items-center justify-center w-full px-4 py-2 transition-all duration-300 bg-black text-white rounded-3xl hover:bg-black/90"
                          onClick={toggleMenu}
                        >
                          <LogIn className="h-5 w-5 mr-2" />
                          Sign In
                        </Link>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          to="/register"
                          className="flex items-center justify-center w-full px-4 py-1.5 transition-all duration-300 bg-white hover:bg-black/90 rounded-3xl text-black border border-2 border-black"
                          onClick={toggleMenu}
                        >
                          <User className="h-5 w-5 mr-2" />
                          Join Us
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// Enhanced desktop navigation link with animated underline effect
const NavLink = ({ to, className, children, scrolled = false }: NavLinkProps) => {
  const { currentPage, pageTheme } = useSelector((state: RootState) => state.navigation);
  const isActive = currentPage === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "font-medium transition-all duration-300 relative group py-2",
        scrolled ? "text-black hover:text-blue-600" : pageTheme === 'dark' ? "text-white hover:text-blue-300" : "text-black hover:text-blue-500",
        isActive && "text-white bg-gradient-to-r from-blue-900 to-purple-700 px-2 py-1 rounded-full transition-all duration-300 ease-in-out hover:text-gray-300",
        className
      )}
    >
      {children}
      {!isActive && (
        <span
          className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-500"
        ></span>
      )}
    </Link>
  );
};

// Enhanced mobile navigation link with subtle animation
const MobileNavLink = ({
  to,
  className,
  onClick,
  children,
}: MobileNavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center w-full px-4 py-3 transition-all duration-300 text-purple-800 hover:bg-blue-50 rounded-3xl hover:text-blue-600",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Header;
