import { useState, useEffect, useRef } from "react";
import { Post, User } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { getAIComment } from "@/lib/ai-responses";
import { Link } from "wouter";
import { Heart, MessageCircle, Share2, X } from "lucide-react";

interface VideoPlayerProps {
  post: Post;
  isActive: boolean;
  className?: string;
}

export default function VideoPlayer({ post, isActive, className = "" }: VideoPlayerProps) {
  const { user: currentUser } = useAuth();
  const [showControls, setShowControls] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Fetch post owner
  const { data: postOwner } = useQuery<User>({
    queryKey: [`/api/users/${post.userId}`],
    enabled: !!post.userId,
  });
  
  // Fetch likes
  const { data: likes } = useQuery<any[]>({
    queryKey: [`/api/posts/${post.id}/likes`],
    enabled: !!post.id,
  });
  
  // Check if current user liked this post
  useEffect(() => {
    if (likes && currentUser) {
      setIsLiked(likes.some(like => like.userId === currentUser.id));
    }
  }, [likes, currentUser]);
  
  // Toggle video play/pause when active status changes
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive]);
  
  // Like/unlike mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        await apiRequest("DELETE", "/api/likes", { postId: post.id });
      } else {
        await apiRequest("POST", "/api/likes", { postId: post.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/likes`] });
      setIsLiked(!isLiked);
    },
  });
  
  // Double tap to like
  const handleDoubleTap = () => {
    if (!isLiked) {
      likeMutation.mutate();
      showHeartEffect();
    }
  };
  
  // Show heart animation
  const showHeartEffect = () => {
    setShowHeartAnimation(true);
    setTimeout(() => {
      setShowHeartAnimation(false);
    }, 1000);
  };
  
  // Toggle play/pause on click
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };
  
  // AI comment for this post
  const aiComment = getAIComment(post.id);
  
  return (
    <div 
      className={`relative ${className}`}
      onDoubleClick={handleDoubleTap}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={post.mediaUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        onClick={handleVideoClick}
      />
      
      {/* Heart Animation */}
      {showHeartAnimation && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="text-white text-7xl animate-heart-burst" fill="white" />
        </div>
      )}
      
      {/* Video Controls Overlay */}
      <div 
        className={`absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-b from-black/30 to-black/50 text-white transition-opacity duration-200 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex justify-between">
          <span className="bg-black/50 px-2 py-1 rounded-full text-xs">
            <i className="fas fa-eye mr-1"></i> {Math.floor(Math.random() * 50000) + 1000}
          </span>
          <button className="bg-black/50 p-2 rounded-full">
            <X size={16} />
          </button>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <h3 className="font-bold text-lg">{post.content}</h3>
            <div className="flex items-center mt-2">
              <Link href={`/profile/${postOwner?.id}`}>
                <a className="flex items-center">
                  <img 
                    src={postOwner?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330"} 
                    alt={postOwner?.displayName || "User"} 
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                  <span className="ml-2 font-medium">@{postOwner?.username}</span>
                </a>
              </Link>
              <button className="ml-2 bg-white text-primary text-xs px-2 py-1 rounded-full font-bold">
                Follow
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <button 
              className={`bg-white/20 p-2 rounded-full backdrop-blur-sm ${isLiked ? 'text-red-500' : 'text-white'}`}
              onClick={() => likeMutation.mutate()}
            >
              <Heart size={24} fill={isLiked ? "#ef4444" : "none"} />
            </button>
            <span className="text-sm font-medium">{(likes?.length || 0) + (isLiked ? 0 : 1)}K</span>
            
            <button className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <MessageCircle size={24} />
            </button>
            <span className="text-sm font-medium">{Math.floor(Math.random() * 2000) + 100}</span>
            
            <button className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Share2 size={24} />
            </button>
            <span className="text-sm font-medium">{Math.floor(Math.random() * 5000) + 500}</span>
          </div>
        </div>
      </div>
      
      {/* AI Commentary */}
      <div className="absolute left-4 right-20 bottom-20 bg-black/60 p-3 rounded-lg backdrop-blur-sm">
        <div className="flex space-x-2">
          <div className="bg-primary p-2 rounded-full h-min shrink-0">
            <i className="fas fa-robot text-white text-sm"></i>
          </div>
          <div>
            <h4 className="text-white text-sm flex items-center">
              <span>Sentinel Intelligence</span>
              <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">AI</span>
            </h4>
            <p className="text-xs text-white/90 mt-1">{aiComment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
