import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Sample suggestion users data
const suggestedUsers = [
  {
    id: 6,
    username: "lisathomson",
    displayName: "Lisa Thomson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    profession: "Dance Instructor",
    mutualConnections: 12
  },
  {
    id: 7,
    username: "robertkiyoshi",
    displayName: "Robert Kiyoshi",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    profession: "Filmmaker",
    mutualConnections: 5
  }
];

export default function SuggestionCard() {
  const { toast } = useToast();

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest("POST", "/api/follows", { followingId: userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "You are now following this user",
      });
    },
  });

  return (
    <div>
      <h2 className="font-bold text-lg mb-4">People You May Know</h2>
      
      <div className="space-y-3">
        {suggestedUsers.map(user => (
          <div key={user.id} className="flex items-center">
            <Link href={`/profile/${user.id}`}>
              <a>
                <img 
                  src={user.avatar} 
                  alt={`${user.displayName}'s profile`} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              </a>
            </Link>
            <div className="ml-3 flex-1">
              <Link href={`/profile/${user.id}`}>
                <a className="font-medium hover:underline">{user.displayName}</a>
              </Link>
              <p className="text-xs text-gray-600">{user.profession} • {user.mutualConnections} mutual connections</p>
            </div>
            <Button
              variant="ghost"
              className="text-primary hover:bg-primary/10 px-3 py-1 rounded-full text-sm font-medium"
              onClick={() => followMutation.mutate(user.id)}
              disabled={followMutation.isPending}
            >
              Connect
            </Button>
          </div>
        ))}
        
        <button className="w-full mt-2 text-primary text-sm font-medium">
          See More Suggestions
        </button>
      </div>
    </div>
  );
}
