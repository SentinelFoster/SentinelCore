import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function MonetizationCard() {
  const { user } = useAuth();
  const [earnings] = useState("1,842.63");
  const [goal] = useState("2,500");
  const [percentage] = useState(74);

  return (
    <div className="mb-6">
      <h2 className="font-bold text-lg mb-4">Monetization</h2>
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold">Creator Earnings</span>
          <span className="text-sm text-primary font-medium cursor-pointer">View Report</span>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">This Month</span>
            <span className="font-bold">${earnings}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>Goal: ${goal}</span>
            <span>{percentage}% Complete</span>
          </div>
        </div>
        <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Withdraw Funds
        </button>
      </div>
    </div>
  );
}
