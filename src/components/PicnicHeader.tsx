import React from 'react';
import { Sun, TreePine, Utensils } from 'lucide-react';

export const PicnicHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Picnic Planner</h1>
              <p className="text-sm text-gray-600">Create the perfect outdoor experience</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <TreePine className="w-4 h-4" />
              <span>Outdoor Fun</span>
            </div>
            <div className="flex items-center space-x-1">
              <Utensils className="w-4 h-4" />
              <span>No Login Required</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};