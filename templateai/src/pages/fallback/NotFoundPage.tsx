import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white min-h-screen">
      <h1 className="text-9xl font-bold text-black">404</h1>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Oops! Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-black/80 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
