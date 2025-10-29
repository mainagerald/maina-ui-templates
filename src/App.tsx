import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './components/layouts/RootLayout';
import ErrorBoundary from './components/layouts/state/ErrorBoundary';
import { NavigationLoadingProvider } from './components/layouts/state/NavigationLoadingProvider';
import ErrorFallback from './components/layouts/state/ErrorFallback';
import LoadingFallback from './components/layouts/state/LoadingFallback';
import { AuthProvider, ProtectedRoute, ProtectedComponent } from './auth';
import RoleProtectedComponent from './auth/RoleProtectedComponent';
import { NotificationProvider } from './context/NotificationContext';

// Lazy load pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const RegisterSuccess = lazy(() => import('./pages/auth/RegisterSuccess'));
const EmailVerified = lazy(() => import('./pages/auth/EmailVerified'));
const EmailVerificationFailed = lazy(() => import('./pages/auth/EmailVerificationFailed'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const AuthCallback = lazy(() => import('./auth/AuthCallback'));
const NotFoundPage = lazy(() => import('./pages/fallback/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/fallback/UnauthorizedPage'));

// Main pages
const HomePage = lazy(() => import('./pages/main/HomePage'));
const EventsPage = lazy(() => import('./pages/main/events/EventsPage'));
const ResourcesPage = lazy(() => import('./pages/main/ResourcesPage'));
const ProjectsPage = lazy(() => import('./pages/main/projects/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/main/projects/ProjectDetailPage'));
const ForumsPage = lazy(() => import('./pages/main/forums/ForumsPage'));
const ThreadDetailPage = lazy(() => import('./pages/main/forums/ThreadDetailPage'));
const JobsPage = lazy(() => import('./pages/main/JobsPage'));
const ProfilePage = lazy(() => import('./pages/main/ProfilePage'));
const AboutPage = lazy(() => import('./pages/main/About'));
const EventDetailsPage = lazy(() => import('./pages/main/events/EventDetailsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/policy/PrivacyPolicy'));
const TermsAndConditionsPage = lazy(() => import('./pages/policy/TermsAndConditions'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminHome = lazy(() => import('./pages/admin/AdminHome'));
const ProjectApprovals = lazy(() => import('./pages/admin/ProjectApprovals'));
const ContentModeration = lazy(() => import('./pages/admin/ContentModeration'));
const ResourcesManagement = lazy(() => import('./pages/admin/ResourcesManagement'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const EventsManagement = lazy(() => import('./pages/admin/EventsManagement'));

// LazyComponentWrapper for code splitting
const LazyComponentWrapper = ({ component: Component }: { component: React.ComponentType }) => (
  <ErrorBoundary fallback={<ErrorFallback />}>
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NavigationLoadingProvider>
          <Routes>
          <Route element={<ProtectedRoute requireAuth={false} redirectPath="/profile" />}>
            <Route path='/login' element={<LazyComponentWrapper component={Login} />}/>
            <Route path='/register' element={<LazyComponentWrapper component={Register} />}/>
            <Route path='/register-success' element={<LazyComponentWrapper component={RegisterSuccess} />}/>
            <Route path='/email-verified' element={<LazyComponentWrapper component={EmailVerified} />}/>
            <Route path='/email-verification-failed' element={<LazyComponentWrapper component={EmailVerificationFailed} />}/>
            <Route path='/verify-email/:token' element={<LazyComponentWrapper component={VerifyEmail} />}/>
            <Route path='/auth/callback' element={<LazyComponentWrapper component={AuthCallback} />}/>
          </Route>

          
          <Route path="/" element={<RootLayout />}>
            <Route index element={<LazyComponentWrapper component={HomePage} />} />
            <Route path="events" element={<LazyComponentWrapper component={EventsPage} />} />
            <Route path="events/:id" element={<LazyComponentWrapper component={EventDetailsPage} />} />
            <Route path="resources" element={<LazyComponentWrapper component={ResourcesPage} />} />
            <Route path="projects" element={<LazyComponentWrapper component={ProjectsPage} />} />
            <Route path="projects/:id" element={<LazyComponentWrapper component={ProjectDetailPage} />} />
            <Route path="about" element={<LazyComponentWrapper component={AboutPage} />} />
            <Route path="forums" element={<LazyComponentWrapper component={ForumsPage} />} />
            <Route path="forums/thread/:id" element={<LazyComponentWrapper component={ThreadDetailPage} />} />
            <Route path="jobs" element={<LazyComponentWrapper component={JobsPage} />} />
            <Route path="profile" element={<LazyComponentWrapper component={() => <ProtectedComponent component={ProfilePage} />} />} />
            <Route path="profile/:publicId" element={<LazyComponentWrapper component={ProfilePage} />} />
            <Route path="unauthorized" element={<LazyComponentWrapper component={UnauthorizedPage} />} />
          </Route>
          
          <Route path="admin/login" element={<LazyComponentWrapper component={AdminLogin} />} />
          <Route 
            path="admin" 
            element={
              <LazyComponentWrapper 
                component={() => 
                  <RoleProtectedComponent 
                    component={AdminDashboard} 
                    allowedRoles={['admin', 'moderator', 'super']} 
                    redirectPath="/unauthorized"
                  />
                } 
              />
            }
          >
            <Route index element={<LazyComponentWrapper component={AdminHome} />} />
            <Route path="projects" element={<LazyComponentWrapper component={ProjectApprovals} />} />
            <Route path="moderation" element={<LazyComponentWrapper component={ContentModeration} />} />
            <Route path="resources" element={<LazyComponentWrapper component={ResourcesManagement} />} />
            <Route path="events" element={<LazyComponentWrapper component={EventsManagement} />} />
            <Route 
              path="users" 
              element={
                <LazyComponentWrapper
                  component={() => 
                    <RoleProtectedComponent 
                      component={UserManagement} 
                      allowedRoles={['admin', 'super']} 
                      redirectPath="/admin"
                    />
                  }
                />
              } 
            />
            <Route path="settings" element={<LazyComponentWrapper component={AdminSettings} />} />
          </Route>
          <Route path="policy" element={<LazyComponentWrapper component={PrivacyPolicyPage} />} />
          <Route path="terms-and-conditions" element={<LazyComponentWrapper component={TermsAndConditionsPage} />} />          
          <Route path="*" element={<LazyComponentWrapper component={NotFoundPage} />} />
        </Routes>
        </NavigationLoadingProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
