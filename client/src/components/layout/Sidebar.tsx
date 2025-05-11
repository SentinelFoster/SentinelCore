import { Link, useLocation } from "wouter";
import { User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Home, Compass, Users, Wallet, Brain, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <i className="fas fa-shield-alt text-primary text-2xl"></i>
          <h1 className="font-heading font-bold text-xl text-primary">SentinelCast</h1>
        </div>
      </div>

      <div className="flex flex-col p-4 space-y-6 flex-grow">
        <Link href="/">
          <a className={`flex items-center space-x-3 font-medium ${isActive('/') || isActive('/community') ? 'text-primary' : 'text-gray-600 hover:text-primary transition-colors'}`}>
            <Home className="w-6 h-6" />
            <span>Home</span>
          </a>
        </Link>
        
        <Link href="/feed">
          <a className={`flex items-center space-x-3 font-medium ${isActive('/feed') ? 'text-primary' : 'text-gray-600 hover:text-primary transition-colors'}`}>
            <Compass className="w-6 h-6" />
            <span>Discover</span>
          </a>
        </Link>
        
        <Link href="/community">
          <a className={`flex items-center space-x-3 font-medium ${isActive('/community') ? 'text-primary' : 'text-gray-600 hover:text-primary transition-colors'}`}>
            <Users className="w-6 h-6" />
            <span>Community</span>
          </a>
        </Link>
        
        <a href="#" className="flex items-center space-x-3 text-gray-600 font-medium hover:text-primary transition-colors">
          <Wallet className="w-6 h-6" />
          <span>Monetization</span>
        </a>
        
        <a href="#" className="flex items-center space-x-3 text-gray-600 font-medium hover:text-primary transition-colors">
          <Brain className="w-6 h-6" />
          <span>Intelligence</span>
        </a>
        
        <div className="mt-auto">
          <a href="#" className="flex items-center space-x-3 text-gray-600 font-medium hover:text-primary transition-colors">
            <Settings className="w-6 h-6" />
            <span>Settings</span>
          </a>
          
          <a href="#" className="flex items-center space-x-3 text-gray-600 font-medium hover:text-primary transition-colors mt-4">
            <HelpCircle className="w-6 h-6" />
            <span>Help</span>
          </a>
          
          <Button
            variant="ghost"
            className="flex items-center space-x-3 text-gray-600 font-medium hover:text-red-500 transition-colors mt-6 w-full justify-start p-2"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-6 h-6" />
            <span>{logoutMutation.isPending ? "Logging out..." : "Logout"}</span>
          </Button>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Link href={`/profile/${user.id}`}>
          <a className="flex items-center space-x-3">
            <img 
              src={user.avatar || "https://images.unsplash.com/photo-1599566150163-29194dcaad36"}
              alt={`${user.displayName}'s profile`} 
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-sm">{user.displayName}</p>
              <p className="text-xs text-gray-600">@{user.username}</p>
            </div>
          </a>
        </Link>
      </div>
    </nav>
  );
}
