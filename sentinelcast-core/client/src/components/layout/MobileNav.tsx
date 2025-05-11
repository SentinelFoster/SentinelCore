import { Link, useLocation } from "wouter";
import { Home, Compass, MessageSquare, User, PlusCircle } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="md:hidden flex justify-around items-center bg-white border-t border-gray-200 py-3 fixed bottom-0 w-full z-20">
      <Link href="/community">
        <a className={`flex flex-col items-center ${isActive('/community') ? 'text-primary' : 'text-gray-600'}`}>
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </a>
      </Link>
      
      <Link href="/feed">
        <a className={`flex flex-col items-center ${isActive('/feed') ? 'text-primary' : 'text-gray-600'}`}>
          <Compass className="w-6 h-6" />
          <span className="text-xs mt-1">Discover</span>
        </a>
      </Link>
      
      <a href="#" className="flex flex-col items-center">
        <button className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center">
          <PlusCircle className="w-6 h-6" />
        </button>
      </a>
      
      <a href="#" className="flex flex-col items-center text-gray-600">
        <MessageSquare className="w-6 h-6" />
        <span className="text-xs mt-1">Messages</span>
      </a>
      
      <Link href={`/profile`}>
        <a className={`flex flex-col items-center ${isActive('/profile') ? 'text-primary' : 'text-gray-600'}`}>
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </Link>
    </nav>
  );
}
