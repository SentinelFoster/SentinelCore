import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  // Redirect to video feed on mobile, and community on desktop
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      setLocation("/feed");
    } else {
      setLocation("/community");
    }
  }, [setLocation]);

  return (
    <AppLayout>
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
      </div>
    </AppLayout>
  );
}
