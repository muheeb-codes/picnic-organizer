import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Zap, Target, Plus, X } from 'lucide-react';
import { GoalInput, Plan } from '../types/plan';
import { generatePlan } from '../utils/planGenerator';

interface GoalInputFormProps {
  onPlanGenerated: (plan: Plan) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export const GoalInputForm: React.FC<GoalInputFormProps> = ({ 
  onPlanGenerated, 
  isGenerating, 
  setIsGenerating 
}) => {
  const [goalInput, setGoalInput] = useState<GoalInput>({
    goal: '',
    deadline: '3',
    timeFrame: 'months',
    availableTime: 30,
    timeUnit: 'minutes',
    preferences: [],
    constraints: [],
    budget: 'medium',
    intensity: 'medium',
    style: 'structured'
  });

  const [newPreference, setNewPreference] = useState('');
  const [newConstraint, setNewConstraint] = useState('');

  const commonPreferences = [
    'Audio learning', 'Visual learning', 'Hands-on practice', 'Online courses',
    'Books/Reading', 'Video tutorials', 'Group activities', 'Self-paced',
    'Structured curriculum', 'Flexible schedule', 'Mobile-friendly', 'Gamified'
  ];

  const commonConstraints = [
    'Limited budget', 'Time constraints', 'Physical limitations', 'No equipment',
    'Beginner level', 'Work schedule', 'Family commitments', 'Travel frequently',
    'No gym access', 'Internet limitations', 'Language barriers', 'Health issues'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.goal.trim()) return;

    setIsGenerating(true);
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const plan = generatePlan(goalInput);
    onPlanGenerated(plan);
    setIsGenerating(false);
  };

  const addPreference = (pref: string) => {
    if (pref && !goalInput.preferences.includes(pref)) {
      setGoalInput(prev => ({
        ...prev,
        preferences: [...prev.preferences, pref]
      }));
    }
  };

  const removePreference = (pref: string) => {
    setGoalInput(prev => ({
      ...prev,
      preferences: prev.preferences.filter(p => p !== pref)
    }));
  };

  const addConstraint = (constraint: string) => {
    if (constraint && !goalInput.constraints.includes(constraint)) {
      setGoalInput(prev => ({
        ...prev,
        constraints: [...prev.constraints, constraint]
      }));
    }
  };

  const removeConstraint = (constraint: string) => {
    setGoalInput(prev => ({
      ...prev,
      constraints: prev.constraints.filter(c => c !== constraint)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What's Your Goal?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell us about your goal and we'll create a personalized, actionable plan to help you achieve it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Goal Input */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Your Goal</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What do you want to achieve?
              </label>
              <textarea
                value={goalInput.goal}
                onChange={(e) => setGoalInput(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="e.g., Learn basic Spanish, lose 10 pounds, start an online business, plan a wedding..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Timeline</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target completion time
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={goalInput.deadline}
                  onChange={(e) => setGoalInput(prev => ({ ...prev, deadline: e.target.value }))}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
                <select
                  value={goalInput.timeFrame}
                  onChange={(e) => setGoalInput(prev => ({ ...prev, timeFrame: e.target.value as 'days' | 'weeks' | 'months' }))}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available time per day
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={goalInput.availableTime}
                  onChange={(e) => setGoalInput(prev => ({ ...prev, availableTime: parseInt(e.target.value) }))}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
                <select
                  value={goalInput.timeUnit}
                  onChange={(e) => setGoalInput(prev => ({ ...prev, timeUnit: e.target.value as 'minutes' | 'hours' }))}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How do you prefer to learn/work?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {commonPreferences.map(pref => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => addPreference(pref)}
                    className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                      goalInput.preferences.includes(pref)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                  placeholder="Add custom preference..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    addPreference(newPreference);
                    setNewPreference('');
                  }}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {goalInput.preferences.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected preferences:
                </label>
                <div className="flex flex-wrap gap-2">
                  {goalInput.preferences.map(pref => (
                    <div key={pref} className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {pref}
                      <button
                        type="button"
                        onClick={() => removePreference(pref)}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Constraints */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Clock className="w-6 h-6 text-orange-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Constraints</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What limitations should we consider?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {commonConstraints.map(constraint => (
                  <button
                    key={constraint}
                    type="button"
                    onClick={() => addConstraint(constraint)}
                    className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                      goalInput.constraints.includes(constraint)
                        ? 'bg-orange-100 border-orange-300 text-orange-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {constraint}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newConstraint}
                  onChange={(e) => setNewConstraint(e.target.value)}
                  placeholder="Add custom constraint..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    addConstraint(newConstraint);
                    setNewConstraint('');
                  }}
                  className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {goalInput.constraints.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected constraints:
                </label>
                <div className="flex flex-wrap gap-2">
                  {goalInput.constraints.map(constraint => (
                    <div key={constraint} className="flex items-center bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                      {constraint}
                      <button
                        type="button"
                        onClick={() => removeConstraint(constraint)}
                        className="ml-2 hover:text-orange-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <DollarSign className="w-6 h-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Plan Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget level
              </label>
              <select
                value={goalInput.budget}
                onChange={(e) => setGoalInput(prev => ({ ...prev, budget: e.target.value as 'low' | 'medium' | 'high' }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low ($0-50)</option>
                <option value="medium">Medium ($50-200)</option>
                <option value="high">High ($200+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity level
              </label>
              <select
                value={goalInput.intensity}
                onChange={(e) => setGoalInput(prev => ({ ...prev, intensity: e.target.value as 'low' | 'medium' | 'high' }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low (Relaxed pace)</option>
                <option value="medium">Medium (Steady progress)</option>
                <option value="high">High (Intensive)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan style
              </label>
              <select
                value={goalInput.style}
                onChange={(e) => setGoalInput(prev => ({ ...prev, style: e.target.value as 'structured' | 'flexible' | 'intensive' }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="structured">Structured (Fixed schedule)</option>
                <option value="flexible">Flexible (Adaptable)</option>
                <option value="intensive">Intensive (Fast-track)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isGenerating || !goalInput.goal.trim()}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Your Plan...</span>
              </>
            ) : (
              <>
                <Target className="w-5 h-5" />
                <span>Generate My Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};