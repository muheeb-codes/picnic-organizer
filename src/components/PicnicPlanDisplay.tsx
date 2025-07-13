import React, { useState } from 'react';
import { ArrowLeft, Download, Calendar, CheckCircle, Circle, Sun, Utensils, Activity, Shield, Copy, MapPin, Users, Clock, DollarSign, Share2, MessageCircle } from 'lucide-react';
import { PicnicPlan, PackingItem } from '../types/picnic';
import { exportPicnicPlan, exportToCalendar, shareToWhatsApp } from '../utils/picnicExportUtils';

interface PicnicPlanDisplayProps {
  plan: PicnicPlan;
  onBackToInput: () => void;
  onNewPlan: () => void;
  onPlanUpdated: (plan: PicnicPlan) => void;
}

export const PicnicPlanDisplay: React.FC<PicnicPlanDisplayProps> = ({ 
  plan, 
  onBackToInput, 
  onNewPlan, 
  onPlanUpdated 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'packing' | 'food' | 'activities' | 'schedule'>('overview');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItemCheck = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const getProgressPercentage = () => {
    if (plan.packingList.length === 0) return 0;
    return Math.round((checkedItems.size / plan.packingList.length) * 100);
  };

  const copyToClipboard = async () => {
    const planText = exportPicnicPlan(plan);
    await navigator.clipboard.writeText(planText);
  };

  const handleExport = (format: 'text' | 'calendar') => {
    if (format === 'text') {
      const planText = exportPicnicPlan(plan);
      const blob = new Blob([planText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `picnic-plan-${plan.date}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'calendar') {
      exportToCalendar(plan);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToInput}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Input</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <button
              onClick={onNewPlan}
              className="flex items-center space-x-2 text-green-600 hover:text-green-800 transition-colors duration-200"
            >
              <Sun className="w-5 h-5" />
              <span>New Picnic</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={() => shareToWhatsApp(plan)}
              className="p-2 text-green-600 hover:text-green-800 transition-colors duration-200"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => shareToWhatsApp(plan)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span>Share on WhatsApp</span>
                </button>
                <button
                  onClick={() => handleExport('text')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200 border-t border-gray-100"
                >
                  Text File (.txt)
                </button>
                <button
                  onClick={() => handleExport('calendar')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  Calendar (.ics)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{plan.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{plan.date} at {plan.time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{plan.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{plan.groupSize.adults + plan.groupSize.kids} people</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{plan.duration}h</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Packing Progress</div>
            <div className="flex items-center space-x-3">
              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <span className="text-lg font-semibold text-gray-900">{getProgressPercentage()}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Picnic Summary</h2>
        <p className="text-gray-700 leading-relaxed">{plan.summary}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: Sun },
          { id: 'packing', label: 'Packing List', icon: CheckCircle },
          { id: 'food', label: 'Food Ideas', icon: Utensils },
          { id: 'activities', label: 'Activities', icon: Activity },
          { id: 'schedule', label: 'Schedule', icon: Calendar }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Weather & Safety Tips</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Weather Considerations</h3>
                  <ul className="space-y-2">
                    {plan.weatherTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-700">
                        <Sun className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Safety Tips</h3>
                  <ul className="space-y-2">
                    {plan.safetyTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-700">
                        <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Backup Plans</h2>
              <div className="space-y-3">
                {plan.backupPlans.map((plan, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{plan}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Breakdown</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Estimated Total</span>
                  <span className="text-xl font-bold text-green-600">{plan.budget.estimated}</span>
                </div>
                <div className="space-y-2">
                  {plan.budget.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{item.category}</span>
                      <span className="text-gray-900">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Checklist</h2>
              <div className="space-y-3">
                {plan.packingList.filter(item => item.essential).slice(0, 8).map(item => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleItemCheck(item.id)}
                      className="flex-shrink-0"
                    >
                      {checkedItems.has(item.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <span className={`text-sm ${
                      checkedItems.has(item.id) ? 'line-through text-gray-500' : 'text-gray-700'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'packing' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Packing List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['food', 'gear', 'activities', 'safety', 'comfort'].map(category => (
              <div key={category} className="space-y-3">
                <h3 className="font-medium text-gray-900 capitalize">{category}</h3>
                <div className="space-y-2">
                  {plan.packingList.filter(item => item.category === category).map(item => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <button
                        onClick={() => toggleItemCheck(item.id)}
                        className="flex-shrink-0 mt-0.5"
                      >
                        {checkedItems.has(item.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          checkedItems.has(item.id) ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </div>
                        {item.quantity && (
                          <div className="text-sm text-gray-600">{item.quantity}</div>
                        )}
                        {item.notes && (
                          <div className="text-sm text-gray-500 mt-1">{item.notes}</div>
                        )}
                      </div>
                      {item.essential && (
                        <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          Essential
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'food' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Food & Drink Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['main', 'side', 'snack', 'dessert', 'drink'].map(category => (
              <div key={category} className={category === 'drink' ? 'md:col-span-2' : ''}>
                <h3 className="font-medium text-gray-900 capitalize mb-4">{category}s</h3>
                <div className="space-y-4">
                  {plan.foodSuggestions.filter(food => food.category === category).map(food => (
                    <div key={food.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{food.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{food.servings}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            food.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            food.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {food.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">Prep time: {food.prepTime}</div>
                      {food.recipe && (
                        <div className="text-sm text-gray-700 mb-2">{food.recipe}</div>
                      )}
                      {food.tips && (
                        <div className="text-sm text-blue-600 italic">{food.tips}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Planned Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plan.activities.map(activity => (
              <div key={activity.id} className="p-6 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">{activity.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Duration: {activity.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Participants: {activity.participants}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Age group: {activity.ageGroup}</span>
                  </div>
                </div>
                <p className="text-gray-700 mt-3">{activity.description}</p>
                {activity.equipment.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-900 mb-1">Equipment needed:</div>
                    <div className="flex flex-wrap gap-2">
                      {activity.equipment.map((item, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Suggested Schedule</h2>
          <div className="space-y-4">
            {plan.schedule.map((slot, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="text-lg font-medium text-gray-900">{slot.timeSlot}</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{slot.activity}</h3>
                  <p className="text-gray-600">{slot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};