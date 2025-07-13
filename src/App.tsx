import React, { useState, useEffect } from 'react';
import { PicnicInputForm } from './components/PicnicInputForm';
import { PicnicPlanDisplay } from './components/PicnicPlanDisplay';
import { PicnicHeader } from './components/PicnicHeader';
import { PicnicPlan } from './types/picnic';

function App() {
  const [currentStep, setCurrentStep] = useState<'input' | 'plan'>('input');
  const [generatedPlan, setGeneratedPlan] = useState<PicnicPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('picnicMaker_currentPlan');
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        setGeneratedPlan(parsed);
        setCurrentStep('plan');
      } catch (error) {
        console.error('Error loading saved plan:', error);
      }
    }
  }, []);

  const handlePlanGenerated = (plan: PicnicPlan) => {
    setGeneratedPlan(plan);
    setCurrentStep('plan');
    // Save to localStorage
    localStorage.setItem('picnicMaker_currentPlan', JSON.stringify(plan));
  };

  const handleBackToInput = () => {
    setCurrentStep('input');
  };

  const handleNewPlan = () => {
    setGeneratedPlan(null);
    setCurrentStep('input');
    localStorage.removeItem('picnicMaker_currentPlan');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <PicnicHeader />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'input' ? (
          <PicnicInputForm 
            onPlanGenerated={handlePlanGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
        ) : (
          <PicnicPlanDisplay 
            plan={generatedPlan!}
            onBackToInput={handleBackToInput}
            onNewPlan={handleNewPlan}
            onPlanUpdated={handlePlanGenerated}
          />
        )}
      </main>
    </div>
  );
}

export default App;