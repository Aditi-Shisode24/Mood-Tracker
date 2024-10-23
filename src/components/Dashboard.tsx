import React from 'react';
import { BarChart, Calendar, BookOpen, CheckSquare, Clock } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Welcome back, User!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#fbf8cc] rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <BarChart className="mr-2 h-5 w-5" />
            Mood Overview
          </h2>
          <p className="text-gray-600">Your mood has been mostly positive this week!</p>
        </div>
        
        <div className="bg-[#fde4cf] rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Recent Moods
          </h2>
          <div className="flex space-x-2">
            <span className="text-2xl">😊</span>
            <span className="text-2xl">😄</span>
            <span className="text-2xl">😌</span>
          </div>
        </div>
        
        <div className="bg-[#ffcfd2] rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <BookOpen className="mr-2 h-5 w-5" />
            Gratitude Entries
          </h2>
          <p className="text-gray-600">You've logged 5 gratitude entries this week.</p>
        </div>
        
        <div className="bg-[#f1c0e8] rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <CheckSquare className="mr-2 h-5 w-5" />
            Task Completion
          </h2>
          <p className="text-gray-600">You've completed 8 out of 10 tasks. Great job!</p>
        </div>
        
        <div className="bg-[#cfbaf0] rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Daily Planning
          </h2>
          <p className="text-gray-600">You have 3 important tasks planned for today.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;