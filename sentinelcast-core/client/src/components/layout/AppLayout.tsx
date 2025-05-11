import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import MessagePreview from "@/components/messaging/MessagePreview";
import MonetizationCard from "@/components/MonetizationCard";
import SuggestionCard from "@/components/SuggestionCard";
import { useLocation } from "wouter";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { user, isLoading } = useAuth();
  const [location] = useLocation();
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);
  
  // If still loading auth, show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // If no user is logged in (shouldn't happen with protected routes, but just in case)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to access this page</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Header - Only visible on mobile */}
      <header className="md:hidden bg-white border-b border-gray-200 p-3 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <i className="fas fa-shield-alt text-primary text-2xl"></i>
          <h1 className="font-heading font-bold text-xl text-primary">SentinelCast</h1>
        </div>
        <div className="flex space-x-4">
          <button className="text-gray-800">
            <i className="fas fa-search text-xl"></i>
          </button>
          <button className="text-gray-800">
            <i className="fas fa-bell text-xl"></i>
          </button>
        </div>
      </header>
      
      {/* Desktop Sidebar */}
      <Sidebar user={user} />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Content Area */}
        <div className="flex-1 max-w-3xl w-full">
          {children}
        </div>
        
        {/* Side Column - Only visible on desktop */}
        {!isMobile && !location.includes('/feed') && (
          <div className="hidden md:block w-80 p-4 bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto">
            <MonetizationCard />
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg">Messages</h2>
                <button className="text-primary">
                  <i className="fas fa-edit"></i>
                </button>
              </div>
              
              <div className="space-y-2">
                <MessagePreview 
                  id={1}
                  avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
                  name="Michael Torres"
                  message="Thanks for helping with the park cleanup!"
                  time="12m"
                  isOnline={true}
                  isAI={false}
                />
                
                <MessagePreview 
                  id={2}
                  avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
                  name="Sophia Chen"
                  message="Did you see the latest educational content? It's amazing"
                  time="2h"
                  isOnline={false}
                  isAI={false}
                />
                
                <MessagePreview 
                  id="ai"
                  name="Sentinel AI"
                  message="I've analyzed your latest content and have some suggestions..."
                  time="Now"
                  isOnline={true}
                  isAI={true}
                />
              </div>
              
              <button className="w-full mt-3 text-primary text-sm font-medium">
                See All Messages
              </button>
            </div>
            
            <SuggestionCard />
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
