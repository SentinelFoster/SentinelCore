import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Post } from "@shared/schema";
import VideoPlayer from "@/components/feed/VideoPlayer";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function VideoFeedPage() {
  const { user } = useAuth();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch posts
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  // Filter only video posts
  const videoPosts = posts?.filter((post) => post.mediaType === 'video') || [];

  // Handle swipe navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const startY = e.touches[0].clientY;
      
      const handleTouchMove = (e: TouchEvent) => {
        const currentY = e.touches[0].clientY;
        const diff = startY - currentY;
        
        // Threshold for swipe detection
        if (Math.abs(diff) > 50) {
          if (diff > 0 && currentVideoIndex < videoPosts.length - 1) {
            // Swipe up - next video
            setCurrentVideoIndex(prev => prev + 1);
          } else if (diff < 0 && currentVideoIndex > 0) {
            // Swipe down - previous video
            setCurrentVideoIndex(prev => prev - 1);
          }
          
          // Remove the move listener after a swipe is detected
          document.removeEventListener('touchmove', handleTouchMove);
        }
      };
      
      document.addEventListener('touchmove', handleTouchMove);
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchend', handleTouchEnd);
    };
    
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      videoContainer.addEventListener('touchstart', handleTouchStart);
      
      return () => {
        videoContainer.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [currentVideoIndex, videoPosts.length]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-4">
            <p className="text-red-500">Error loading videos</p>
            <p className="text-sm text-gray-500">{(error as Error).message}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (videoPosts.length === 0) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center p-4">
            <p className="text-xl font-semibold mb-2">No videos found</p>
            <p className="text-sm text-gray-500">Be the first to post a video!</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div 
        ref={videoContainerRef}
        className="relative h-[calc(100vh-8rem)] md:h-[calc(100vh-0rem)] overflow-hidden bg-black"
      >
        {videoPosts.map((post, index) => (
          <VideoPlayer
            key={post.id}
            post={post}
            isActive={currentVideoIndex === index}
            className={`absolute inset-0 ${currentVideoIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          />
        ))}
        
        {/* Swipe indicators */}
        {currentVideoIndex > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-2 py-1 rounded-full text-xs z-20">
            Swipe down for previous
          </div>
        )}
        
        {currentVideoIndex < videoPosts.length - 1 && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-2 py-1 rounded-full text-xs z-20">
            Swipe up for next
          </div>
        )}
      </div>
    </AppLayout>
  );
}
