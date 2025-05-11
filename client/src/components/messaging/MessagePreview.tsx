import { Link } from "wouter";

interface MessagePreviewProps {
  id: number | string;
  avatar?: string;
  name: string;
  message: string;
  time: string;
  isOnline: boolean;
  isAI: boolean;
}

export default function MessagePreview({ id, avatar, name, message, time, isOnline, isAI }: MessagePreviewProps) {
  return (
    <div className={`flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${isAI ? 'bg-gray-50/70' : ''}`}>
      <div className="relative">
        {isAI ? (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <i className="fas fa-robot"></i>
          </div>
        ) : (
          <img 
            src={avatar} 
            alt={`${name}'s profile`} 
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        
        {/* Online status indicator */}
        <span className={`absolute bottom-0 right-0 w-3 h-3 ${isOnline ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-2 border-white ${isAI && isOnline ? 'animate-pulse-slow' : ''}`}></span>
      </div>
      
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between">
          <h4 className="font-medium flex items-center">
            <span>{name}</span>
            {isAI && <span className="ml-1 text-xs bg-primary text-white px-1 rounded">AI</span>}
          </h4>
          <span className="text-xs text-gray-600">{time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{message}</p>
      </div>
    </div>
  );
}
