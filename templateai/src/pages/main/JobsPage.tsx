import { Briefcase } from 'lucide-react';

const JobsPage = () => {
  return (
    <div className="space-y-8 min-h-screen px-6">
      <div className='mt-20'>
        <h1 className="text-3xl font-bold">Jobs</h1>
        <p className="text-gray-500 mt-2">
          Find AI-related job opportunities and talent in Kenya and beyond.
        </p>
      </div>
      
      <div className="bg-black/20 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
        <Briefcase className="h-16 w-16 text-blue-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Job Board Coming Soon</h2>
        <p className="text-gray-600 max-w-md text-xs">
          We're building a specialized job board for professionals and young talents. Check back soon to post or find opportunities.
        </p>
      </div>
    </div>
  );
};

export default JobsPage;
