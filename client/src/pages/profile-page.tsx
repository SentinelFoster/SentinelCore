import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Post } from "@shared/schema";
import { useParams } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, UserPlus, UserMinus } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import FeedPost from "@/components/feed/FeedPost";
import VideoPost from "@/components/feed/VideoPost";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user: currentUser } = useAuth();
  const { userId } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");
  
  const targetUserId = userId ? parseInt(userId) : currentUser?.id;
  
  // Fetch user data
  const { data: profileUser, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: [`/api/users/${targetUserId}`],
    enabled: !!targetUserId,
  });
  
  // Fetch user posts
  const { data: userPosts, isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: [`/api/users/${targetUserId}/posts`],
    enabled: !!targetUserId,
  });
  
  // Fetch followers
  const { data: followers } = useQuery<any[]>({
    queryKey: [`/api/users/${targetUserId}/followers`],
    enabled: !!targetUserId,
  });
  
  // Fetch following
  const { data: following } = useQuery<any[]>({
    queryKey: [`/api/users/${targetUserId}/following`],
    enabled: !!targetUserId,
  });
  
  // Check if current user is following this profile
  const isFollowing = followers?.some(follow => follow.followerId === currentUser?.id);
  
  // Follow/Unfollow mutation
  const followMutation = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        await apiRequest("DELETE", "/api/follows", { followingId: targetUserId });
      } else {
        await apiRequest("POST", "/api/follows", { followingId: targetUserId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${targetUserId}/followers`] });
      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: isFollowing ? `You unfollowed ${profileUser?.displayName}` : `You followed ${profileUser?.displayName}`,
      });
    },
  });
  
  // Filter posts by type
  const videoPosts = userPosts?.filter(post => post.mediaType === 'video') || [];
  const photoPosts = userPosts?.filter(post => post.mediaType === 'image') || [];
  
  const isCurrentUserProfile = currentUser?.id === targetUserId;
  
  if (isLoadingUser) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto w-full p-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-primary to-secondary"></div>
          
          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6 border-4 border-white rounded-full">
              <img 
                src={profileUser?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36"}
                alt={profileUser?.displayName} 
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
            
            {/* Action Button */}
            <div className="flex justify-end mt-4 mb-8">
              {isCurrentUserProfile ? (
                <Button variant="outline" className="gap-2">
                  <Edit size={16} /> Edit Profile
                </Button>
              ) : (
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  className="gap-2"
                  onClick={() => followMutation.mutate()}
                  disabled={followMutation.isPending}
                >
                  {followMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isFollowing ? (
                    <UserMinus size={16} />
                  ) : (
                    <UserPlus size={16} />
                  )}
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
            
            {/* User Info */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{profileUser?.displayName}</h1>
              <p className="text-gray-600">@{profileUser?.username}</p>
              <p className="mt-2">{profileUser?.bio || "No bio yet"}</p>
              
              {/* Stats */}
              <div className="flex mt-4 space-x-6">
                <div>
                  <span className="font-bold">{userPosts?.length || 0}</span>
                  <span className="text-gray-600 ml-1">Posts</span>
                </div>
                <div>
                  <span className="font-bold">{followers?.length || 0}</span>
                  <span className="text-gray-600 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold">{following?.length || 0}</span>
                  <span className="text-gray-600 ml-1">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="posts" onClick={() => setActiveTab("posts")}>All Posts</TabsTrigger>
            <TabsTrigger value="videos" onClick={() => setActiveTab("videos")}>Videos</TabsTrigger>
            <TabsTrigger value="photos" onClick={() => setActiveTab("photos")}>Photos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            {isLoadingPosts ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : userPosts && userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((post) => (
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
                <p className="text-gray-500">
                  {isCurrentUserProfile ? "Share your first post!" : "This user hasn't posted anything yet."}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="videos">
            {isLoadingPosts ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : videoPosts.length > 0 ? (
              <div className="space-y-6">
                {videoPosts.map((post) => (
                  <VideoPost key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg font-medium">No videos yet</p>
                <p className="text-gray-500">
                  {isCurrentUserProfile ? "Share your first video!" : "This user hasn't posted any videos yet."}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="photos">
            {isLoadingPosts ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : photoPosts.length > 0 ? (
              <div className="space-y-6">
                {photoPosts.map((post) => (
                  <FeedPost key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg font-medium">No photos yet</p>
                <p className="text-gray-500">
                  {isCurrentUserProfile ? "Share your first photo!" : "This user hasn't posted any photos yet."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
