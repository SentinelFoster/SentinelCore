import { useState, useRef } from "react";
import { Post, User } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { getAIComment } from "@/lib/ai-responses";
import { Link } from "wouter";
import { Heart, MessageCircle, Share2, MoreHorizontal, Play, Maximize2, Volume2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface VideoPostProps {
  post: Post;
}

export default function VideoPost({ post }: VideoPostProps) {
  const { user: currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
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
  
  // Fetch comments
  const { data: comments } = useQuery<any[]>({
    queryKey: [`/api/posts/${post.id}/comments`],
    enabled: !!post.id,
  });
  
  // Check if current user liked this post
  useState(() => {
    if (likes && currentUser) {
      setIsLiked(likes.some(like => like.userId === currentUser.id));
    }
  });
  
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
  
  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (commentData: { postId: number; content: string }) => {
      return await apiRequest("POST", "/api/comments", commentData);
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}/comments`] });
    },
  });
  
  // Handle comment submission
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      commentMutation.mutate({
        postId: post.id,
        content: commentText,
      });
    }
  };
  
  // Toggle video play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // AI comment for this post
  const aiComment = getAIComment(post.id);
  
  // Format post date
  const formatPostDate = (dateString: Date) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between">
          <div className="flex space-x-3">
            <Link href={`/profile/${postOwner?.id}`}>
              <a>
                <img 
                  src={postOwner?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"} 
                  alt={postOwner?.displayName || "User"} 
                  className="w-10 h-10 rounded-full object-cover" 
                />
              </a>
            </Link>
            <div>
              <Link href={`/profile/${postOwner?.id}`}>
                <a className="font-medium hover:underline">{postOwner?.displayName}</a>
              </Link>
              <p className="text-xs text-gray-600">
                {post.createdAt ? formatPostDate(post.createdAt) : "recently"} • <i className="fas fa-globe-americas"></i>
              </p>
            </div>
          </div>
          <button>
            <MoreHorizontal className="text-gray-600" size={20} />
          </button>
        </div>
        
        <div className="mt-3">
          <p>{post.content}</p>
        </div>
      </div>
      
      {/* Video Player */}
      <div className="relative video-container">
        <video
          ref={videoRef}
          src={post.mediaUrl}
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Play Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20" onClick={togglePlay}>
            <button className="bg-white/80 w-16 h-16 rounded-full flex items-center justify-center">
              <Play className="text-primary ml-1" size={28} />
            </button>
          </div>
        )}
        
        {/* Video Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-white">
          <span className="bg-black/50 px-2 py-1 rounded text-sm">03:24</span>
          <div className="flex space-x-2">
            <button className="bg-black/50 p-2 rounded">
              <Maximize2 size={16} />
            </button>
            <button className="bg-black/50 p-2 rounded">
              <Volume2 size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-2">
            <span className="flex items-center space-x-1">
              <Heart className={`${isLiked ? 'text-red-500' : 'text-gray-600'}`} size={16} fill={isLiked ? "#ef4444" : "none"} />
              <span>{likes?.length || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MessageCircle className="text-gray-600" size={16} />
              <span>{comments?.length || 0}</span>
            </span>
          </div>
          <span className="text-sm text-gray-600">{Math.floor(Math.random() * 500) + 50} shares</span>
        </div>
        
        <div className="flex justify-between border-t border-b border-gray-200 py-2">
          <button 
            className={`flex items-center justify-center w-1/3 space-x-1 ${isLiked ? 'text-red-500' : 'text-gray-600'} hover:text-red-500 transition-colors`}
            onClick={() => likeMutation.mutate()}
          >
            <Heart size={16} fill={isLiked ? "#ef4444" : "none"} />
            <span>Like</span>
          </button>
          <button className="flex items-center justify-center w-1/3 space-x-1 text-gray-600 hover:text-primary transition-colors">
            <MessageCircle size={16} />
            <span>Comment</span>
          </button>
          <button className="flex items-center justify-center w-1/3 space-x-1 text-gray-600 hover:text-secondary transition-colors">
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
        
        {/* AI Commentary */}
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex space-x-2">
            <div className="bg-primary p-2 rounded-full h-min">
              <i className="fas fa-robot text-white"></i>
            </div>
            <div>
              <h4 className="font-medium text-sm flex items-center">
                <span>Sentinel Intelligence</span>
                <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">AI</span>
              </h4>
              <p className="text-sm mt-1">{aiComment}</p>
              <button className="text-primary text-xs mt-2">See more insights</button>
            </div>
          </div>
        </div>
        
        {/* Comments */}
        <div className="mt-3">
          <form onSubmit={handleSubmitComment} className="flex space-x-2">
            <img 
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36"} 
              alt="Your profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <input 
              type="text" 
              placeholder="Write a comment..." 
              className="flex-1 bg-gray-50 rounded-full px-4 py-1 text-sm"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button 
              type="submit"
              size="sm"
              variant="ghost"
              className="px-3"
              disabled={!commentText.trim() || commentMutation.isPending}
            >
              {commentMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Post"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
