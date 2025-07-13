import React, { useState } from 'react';
import { ArrowLeft, Download, Calendar, CheckCircle, Circle, Star, Clock, Target, BookOpen, Lightbulb, Edit3, Copy, Share2 } from 'lucide-react';
import { Plan, Phase, ActionStep } from '../types/plan';
import { exportToPDF, exportToCalendar, exportToText } from '../utils/exportUtils';

interface PlanDisplayProps {
  plan: Plan;
  onBackToInput: () => void;
  onNewPlan: () => void;
  onPlanUpdated: (plan: Plan) => void;
}

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ 
  plan, 
  onBackToInput, 
  onNewPlan, 
  onPlanUpdated 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'resources'>('overview');
  const [editingPhase, setEditingPhase] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const toggleActionCompletion = (actionId: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(actionId)) {
      newCompleted.delete(actionId);
    } else {
      newCompleted.add(actionId);
    }
    setCompletedActions(newCompleted);
    
    // Update plan with completion status
    const updatedPlan = {
      ...plan,
      phases: plan.phases.map(phase => ({
        ...phase,
        actions: phase.actions.map(action => ({
          ...action,
          completed: newCompleted.has(action.id)
        }))
      }))
    };
    onPlanUpdated(updatedPlan);
  };

  const getProgressPercentage = () => {
    const totalActions = plan.phases.reduce((sum, phase) => sum + phase.actions.length, 0);
    const completedCount = completedActions.size;
    return totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;
  };

  const copyToClipboard = async () => {
    const planText = exportToText(plan);
    await navigator.clipboard.writeText(planText);
    // Could add a toast notification here
  };

  const handleExport = (format: 'pdf' | 'calendar' | 'text') => {
    switch (format) {
      case 'pdf':
        exportToPDF(plan);
        break;
      case 'calendar':
        exportToCalendar(plan);
        break;
      case 'text':
        const planText = exportToText(plan);
        const blob = new Blob([planText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${plan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        break;
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
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <Target className="w-5 h-5" />
              <span>New Plan</span>
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
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => handleExport('text')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  Text File (.txt)
                </button>
                <button
                  onClick={() => handleExport('calendar')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  Calendar (.ics)
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  PDF Document
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{plan.title}</h1>
            <p className="text-gray-600">{plan.goal}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Progress</div>
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

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: Star },
          { id: 'phases', label: 'Phases', icon: Calendar },
          { id: 'resources', label: 'Resources', icon: BookOpen }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
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
          {/* Plan Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Plan Summary</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium text-gray-900">{plan.totalDuration}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-sm text-gray-500">Phases</div>
                      <div className="font-medium text-gray-900">{plan.phases.length} phases</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm text-gray-500">Total Actions</div>
                      <div className="font-medium text-gray-900">
                        {plan.phases.reduce((sum, phase) => sum + phase.actions.length, 0)} actions
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="text-sm text-gray-500">Checkpoints</div>
                      <div className="font-medium text-gray-900">{plan.checkpoints.length} checkpoints</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                {plan.phases.slice(0, 2).map(phase => (
                  <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{phase.title}</h3>
                    <div className="space-y-2">
                      {phase.actions.slice(0, 3).map(action => (
                        <div key={action.id} className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleActionCompletion(action.id)}
                            className="flex-shrink-0"
                          >
                            {completedActions.has(action.id) ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <span className={`text-sm ${
                            completedActions.has(action.id) ? 'line-through text-gray-500' : 'text-gray-700'
                          }`}>
                            {action.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tips & Checkpoints */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Success Tips</h2>
              <div className="space-y-4">
                {plan.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Checkpoints</h2>
              <div className="space-y-3">
                {plan.checkpoints.map((checkpoint, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{checkpoint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'phases' && (
        <div className="space-y-6">
          {plan.phases.map((phase, index) => (
            <div key={phase.id} className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{phase.title}</h3>
                    <p className="text-gray-600">{phase.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {phase.startDate} - {phase.endDate}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {phase.actions.map(action => (
                  <div key={action.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <button
                      onClick={() => toggleActionCompletion(action.id)}
                      className="flex-shrink-0"
                    >
                      {completedActions.has(action.id) ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        completedActions.has(action.id) ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {action.duration}
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded ${
                      action.priority === 'high' ? 'bg-red-100 text-red-700' :
                      action.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {action.priority}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Phase Milestone</h4>
                <p className="text-blue-800">{phase.milestone}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recommended Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-4">General Resources</h3>
              <div className="space-y-3">
                {plan.resources.map((resource, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">{resource}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Phase-Specific Resources</h3>
              <div className="space-y-4">
                {plan.phases.map((phase, index) => (
                  <div key={phase.id}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Phase {index + 1}: {phase.title}</h4>
                    <div className="space-y-2">
                      {phase.resources.map((resource, resourceIndex) => (
                        <div key={resourceIndex} className="flex items-center space-x-3 p-2 bg-gray-50 rounded text-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-700">{resource}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};