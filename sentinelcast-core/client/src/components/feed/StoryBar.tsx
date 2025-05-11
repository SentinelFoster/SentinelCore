import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Plus } from "lucide-react";

// Sample story users data
const storyUsers = [
  {
    id: 1,
    name: "Jamie",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    hasStory: true,
    viewed: false,
  },
  {
    id: 2,
    name: "Michael",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    hasStory: true,
    viewed: false,
  },
  {
    id: 3,
    name: "Sophia",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    hasStory: true,
    viewed: false,
  },
  {
    id: 4,
    name: "Robert",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    hasStory: true,
    viewed: true,
  },
  {
    id: 5,
    name: "Lisa",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    hasStory: true,
    viewed: true,
  }
];

export default function StoryBar() {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Stories</h2>
        <button className="text-primary text-sm">See All</button>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Your Story */}
        <div className="flex flex-col items-center space-y-1 min-w-[72px]">
          <div className="relative">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36"} 
              alt="Your profile" 
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
              <Plus size={14} />
            </button>
          </div>
          <span className="text-xs text-center">Your Story</span>
        </div>
        
        {/* Other Stories */}
        {storyUsers.map(story => (
          <div key={story.id} className="flex flex-col items-center space-y-1 min-w-[72px]">
            <div className={`p-0.5 ${story.viewed ? 'bg-gradient-to-tr from-gray-400 to-gray-500' : 'bg-gradient-to-tr from-primary to-secondary'} rounded-full`}>
              <img 
                src={story.avatar} 
                alt={`${story.name}'s story`} 
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
            </div>
            <span className="text-xs text-center">{story.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
