import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Video, Image, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreatePost() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string; mediaType?: string; mediaUrl?: string }) => {
      return await apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Post created",
        description: "Your post has been published successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create post",
        description: (error as Error).message || "Something went wrong",
        variant: "destructive",
      });
    }
  });
  
  const handleCreatePost = () => {
    if (!content.trim()) {
      toast({
        title: "Empty post",
        description: "Please add some content to your post",
        variant: "destructive",
      });
      return;
    }
    
    createPostMutation.mutate({
      content,
      mediaType: "text", // Default to text post
    });
  };
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex space-x-3">
        <img 
          src={user?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36"} 
          alt="Your profile" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Share your thoughts..." 
            className="w-full p-2 bg-gray-50 rounded-full px-4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between mt-3">
            <div className="flex space-x-2">
              <button className="flex items-center text-gray-600 hover:text-primary transition-colors">
                <Video size={16} className="mr-1" />
                <span className="text-sm">Video</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-primary transition-colors">
                <Image size={16} className="mr-1" />
                <span className="text-sm">Photo</span>
              </button>
              <button className="flex items-center text-gray-600 hover:text-primary transition-colors">
                <Smile size={16} className="mr-1" />
                <span className="text-sm">Feeling</span>
              </button>
            </div>
            <Button
              onClick={handleCreatePost}
              disabled={createPostMutation.isPending || !content.trim()}
              size="sm"
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader2 size={16} className="mr-1 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
