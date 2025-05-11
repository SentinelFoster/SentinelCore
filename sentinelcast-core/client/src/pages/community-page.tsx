import AppLayout from "@/components/layout/AppLayout";
import StoryBar from "@/components/feed/StoryBar";
import CreatePost from "@/components/feed/CreatePost";
import FeedPost from "@/components/feed/FeedPost";
import VideoPost from "@/components/feed/VideoPost";
import { useQuery } from "@tanstack/react-query";
import { Post, User } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'photos'>('all');
  
  // Fetch posts
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  // Filter posts based on active tab
  const filteredPosts = posts?.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'videos') return post.mediaType === 'video';
    if (activeTab === 'photos') return post.mediaType === 'image';
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto w-full p-4">
        {/* Mobile Tabs */}
        <div className="md:hidden flex justify-around border-b border-gray-200 bg-white sticky top-0 z-10 mb-4">
          <button 
            className={`py-3 px-4 font-medium ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('all')}
          >
            <i className="fas fa-stream mr-1"></i> All
          </button>
          <button 
            className={`py-3 px-4 font-medium ${activeTab === 'videos' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('videos')}
          >
            <i className="fas fa-video mr-1"></i> Videos
          </button>
          <button 
            className={`py-3 px-4 font-medium ${activeTab === 'photos' ? 'text-primary border-b-2 border-primary' : 'text-gray-600'}`}
            onClick={() => setActiveTab('photos')}
          >
            <i className="fas fa-image mr-1"></i> Photos
          </button>
        </div>
        
        {/* Story Bar */}
        <div className="mb-6">
          <StoryBar />
        </div>
        
        {/* Create Post */}
        <div className="mb-6">
          <CreatePost />
        </div>
        
        {/* Posts Feed */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading posts</p>
            <p className="text-sm text-gray-500">{(error as Error).message}</p>
          </div>
        ) : filteredPosts && filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              post.mediaType === 'video' ? (
                <VideoPost key={post.id} post={post} />
              ) : (
                <FeedPost key={post.id} post={post} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-gray-500">Be the first to create a post!</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
