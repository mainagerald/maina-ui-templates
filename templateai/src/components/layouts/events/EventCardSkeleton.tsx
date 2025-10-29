import { Skeleton } from "../Skeleton";

// Event card skeleton
export const EventCardSkeleton: React.FC = () => {
    return (
      <div className="rounded-xl overflow-hidden shadow-md bg-white">
        <Skeleton height="200px" width="100%" />
        <div className="p-4 space-y-3">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="100%" height="60px" />
          <div className="flex justify-between pt-2">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="30%" />
          </div>
        </div>
      </div>
    );
  };