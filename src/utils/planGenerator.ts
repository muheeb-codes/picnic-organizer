import { GoalInput, Plan, Phase, ActionStep } from '../types/plan';

export function generatePlan(input: GoalInput): Plan {
  const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Calculate total duration in days
  const totalDays = calculateTotalDays(input.deadline, input.timeFrame);
  
  // Generate phases based on goal type and duration
  const phases = generatePhases(input, totalDays);
  
  // Generate general resources
  const resources = generateResources(input);
  
  // Generate checkpoints
  const checkpoints = generateCheckpoints(input, phases.length);
  
  // Generate tips
  const tips = generateTips(input);
  
  return {
    id: planId,
    title: `${input.goal} Plan`,
    goal: input.goal,
    totalDuration: `${input.deadline} ${input.timeFrame}`,
    createdAt: new Date().toISOString(),
    phases,
    resources,
    checkpoints,
    tips
  };
}

function calculateTotalDays(deadline: string, timeFrame: 'days' | 'weeks' | 'months'): number {
  const num = parseInt(deadline);
  switch (timeFrame) {
    case 'days':
      return num;
    case 'weeks':
      return num * 7;
    case 'months':
      return num * 30;
    default:
      return num;
  }
}

function generatePhases(input: GoalInput, totalDays: number): Phase[] {
  const phases: Phase[] = [];
  const goalLower = input.goal.toLowerCase();
  
  // Determine number of phases based on duration
  const numPhases = Math.min(Math.max(Math.ceil(totalDays / 14), 2), 8);
  const daysPerPhase = Math.ceil(totalDays / numPhases);
  
  for (let i = 0; i < numPhases; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + (i * daysPerPhase));
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + ((i + 1) * daysPerPhase) - 1);
    
    const phase: Phase = {
      id: `phase_${i + 1}`,
      title: generatePhaseTitle(input.goal, i + 1, numPhases),
      description: generatePhaseDescription(input.goal, i + 1, numPhases),
      startDate: startDate.toLocaleDateString(),
      endDate: endDate.toLocaleDateString(),
      actions: generatePhaseActions(input, i + 1, numPhases),
      milestone: generatePhaseMilestone(input.goal, i + 1, numPhases),
      resources: generatePhaseResources(input, i + 1, numPhases)
    };
    
    phases.push(phase);
  }
  
  return phases;
}

function generatePhaseTitle(goal: string, phaseNumber: number, totalPhases: number): string {
  const goalLower = goal.toLowerCase();
  
  if (goalLower.includes('learn') || goalLower.includes('language')) {
    const phases = ['Foundation & Basics', 'Building Vocabulary', 'Grammar & Structure', 'Conversation Practice', 'Advanced Skills', 'Fluency & Mastery'];
    return phases[phaseNumber - 1] || `Phase ${phaseNumber}`;
  }
  
  if (goalLower.includes('fitness') || goalLower.includes('weight') || goalLower.includes('exercise')) {
    const phases = ['Assessment & Foundation', 'Building Habits', 'Increasing Intensity', 'Strength & Endurance', 'Advanced Training', 'Maintenance'];
    return phases[phaseNumber - 1] || `Phase ${phaseNumber}`;
  }
  
  if (goalLower.includes('business') || goalLower.includes('startup')) {
    const phases = ['Research & Planning', 'Foundation Setup', 'Product Development', 'Marketing & Launch', 'Growth & Scaling', 'Optimization'];
    return phases[phaseNumber - 1] || `Phase ${phaseNumber}`;
  }
  
  // Generic phases
  const genericPhases = ['Foundation', 'Development', 'Implementation', 'Advanced Practice', 'Mastery', 'Optimization'];
  return genericPhases[phaseNumber - 1] || `Phase ${phaseNumber}`;
}

function generatePhaseDescription(goal: string, phaseNumber: number, totalPhases: number): string {
  const goalLower = goal.toLowerCase();
  
  if (goalLower.includes('learn') || goalLower.includes('language')) {
    const descriptions = [
      'Master the fundamentals and basic vocabulary',
      'Expand vocabulary and learn common phrases',
      'Understand grammar rules and sentence structure',
      'Practice speaking and listening skills',
      'Develop advanced communication abilities',
      'Achieve fluency and natural conversation'
    ];
    return descriptions[phaseNumber - 1] || `Continue developing your skills in phase ${phaseNumber}`;
  }
  
  if (goalLower.includes('fitness') || goalLower.includes('weight') || goalLower.includes('exercise')) {
    const descriptions = [
      'Assess current fitness level and establish baseline',
      'Build consistent exercise habits and basic strength',
      'Increase workout intensity and add variety',
      'Focus on strength building and endurance',
      'Advanced training techniques and specialization',
      'Maintain results and continue progression'
    ];
    return descriptions[phaseNumber - 1] || `Continue your fitness journey in phase ${phaseNumber}`;
  }
  
  return `Phase ${phaseNumber} of your journey towards achieving ${goal}`;
}

function generatePhaseActions(input: GoalInput, phaseNumber: number, totalPhases: number): ActionStep[] {
  const actions: ActionStep[] = [];
  const goalLower = input.goal.toLowerCase();
  const dailyTime = input.availableTime;
  const timeUnit = input.timeUnit;
  
  // Generate 3-5 actions per phase
  const numActions = Math.min(Math.max(3, Math.floor(dailyTime / 15)), 5);
  
  for (let i = 0; i < numActions; i++) {
    const action: ActionStep = {
      id: `action_${phaseNumber}_${i + 1}`,
      title: generateActionTitle(input.goal, phaseNumber, i + 1, input.preferences),
      description: generateActionDescription(input.goal, phaseNumber, i + 1, input.preferences),
      duration: generateActionDuration(dailyTime, timeUnit, numActions, i + 1),
      completed: false,
      priority: generateActionPriority(i + 1, numActions)
    };
    
    actions.push(action);
  }
  
  return actions;
}

function generateActionTitle(goal: string, phaseNumber: number, actionNumber: number, preferences: string[]): string {
  const goalLower = goal.toLowerCase();
  
  if (goalLower.includes('learn') || goalLower.includes('language')) {
    const actions = [
      ['Learn basic greetings', 'Practice pronunciation', 'Study alphabet/writing system'],
      ['Build core vocabulary', 'Practice common phrases', 'Listen to native speakers'],
      ['Study grammar basics', 'Practice sentence formation', 'Read simple texts'],
      ['Have conversations', 'Watch movies/shows', 'Practice speaking daily'],
      ['Read complex texts', 'Write essays/stories', 'Engage in debates'],
      ['Maintain fluency', 'Learn specialized vocabulary', 'Perfect pronunciation']
    ];
    
    if (actions[phaseNumber - 1] && actions[phaseNumber - 1][actionNumber - 1]) {
      return actions[phaseNumber - 1][actionNumber - 1];
    }
  }
  
  if (goalLower.includes('fitness') || goalLower.includes('weight') || goalLower.includes('exercise')) {
    const actions = [
      ['Take fitness assessment', 'Set up workout space', 'Plan nutrition'],
      ['Daily cardio routine', 'Basic strength training', 'Track progress'],
      ['Increase workout intensity', 'Add new exercises', 'Improve form'],
      ['Advanced strength training', 'Endurance challenges', 'Flexibility work'],
      ['Specialized training', 'Competition prep', 'Peak performance'],
      ['Maintain routine', 'Adjust as needed', 'Long-term goals']
    ];
    
    if (actions[phaseNumber - 1] && actions[phaseNumber - 1][actionNumber - 1]) {
      return actions[phaseNumber - 1][actionNumber - 1];
    }
  }
  
  return `Action ${actionNumber} - Phase ${phaseNumber}`;
}

function generateActionDescription(goal: string, phaseNumber: number, actionNumber: number, preferences: string[]): string {
  const goalLower = goal.toLowerCase();
  
  // Add preference-based modifications
  let description = `Complete this action as part of phase ${phaseNumber}`;
  
  if (preferences.includes('Audio learning')) {
    description += ' - Focus on audio materials and listening exercises';
  }
  
  if (preferences.includes('Visual learning')) {
    description += ' - Use visual aids, charts, and diagrams';
  }
  
  if (preferences.includes('Hands-on practice')) {
    description += ' - Emphasize practical, hands-on activities';
  }
  
  return description;
}

function generateActionDuration(dailyTime: number, timeUnit: string, numActions: number, actionNumber: number): string {
  const totalMinutes = timeUnit === 'hours' ? dailyTime * 60 : dailyTime;
  const timePerAction = Math.floor(totalMinutes / numActions);
  
  if (timePerAction >= 60) {
    return `${Math.floor(timePerAction / 60)}h ${timePerAction % 60}m`;
  }
  
  return `${timePerAction}m`;
}

function generateActionPriority(actionNumber: number, totalActions: number): 'high' | 'medium' | 'low' {
  if (actionNumber === 1) return 'high';
  if (actionNumber <= Math.ceil(totalActions / 2)) return 'medium';
  return 'low';
}

function generatePhaseMilestone(goal: string, phaseNumber: number, totalPhases: number): string {
  const goalLower = goal.toLowerCase();
  
  if (goalLower.includes('learn') || goalLower.includes('language')) {
    const milestones = [
      'Can introduce yourself and handle basic interactions',
      'Understand and use 500+ common words',
      'Can form grammatically correct sentences',
      'Can have 10-minute conversations',
      'Can read and write complex texts',
      'Achieved conversational fluency'
    ];
    return milestones[phaseNumber - 1] || `Phase ${phaseNumber} milestone achieved`;
  }
  
  if (goalLower.includes('fitness') || goalLower.includes('weight') || goalLower.includes('exercise')) {
    const milestones = [
      'Established baseline fitness level',
      'Built consistent exercise habits',
      'Increased strength and endurance',
      'Achieved significant fitness gains',
      'Reached advanced fitness level',
      'Maintained long-term fitness goals'
    ];
    return milestones[phaseNumber - 1] || `Phase ${phaseNumber} milestone achieved`;
  }
  
  return `Successfully completed phase ${phaseNumber} objectives`;
}

function generatePhaseResources(input: GoalInput, phaseNumber: number, totalPhases: number): string[] {
  const goalLower = input.goal.toLowerCase();
  const resources: string[] = [];
  
  if (goalLower.includes('learn') || goalLower.includes('language')) {
    const phaseResources = [
      ['Duolingo app', 'Language learning books', 'Pronunciation guides'],
      ['Flashcard apps', 'Audio courses', 'Language exchange apps'],
      ['Grammar workbooks', 'Online exercises', 'Language forums'],
      ['Conversation practice apps', 'Movies with subtitles', 'Podcasts'],
      ['Advanced textbooks', 'Literature', 'Writing communities'],
      ['Professional materials', 'Specialized dictionaries', 'Native speaker groups']
    ];
    
    if (phaseResources[phaseNumber - 1]) {
      resources.push(...phaseResources[phaseNumber - 1]);
    }
  }
  
  if (goalLower.includes('fitness') || goalLower.includes('weight') || goalLower.includes('exercise')) {
    const phaseResources = [
      ['Fitness assessment tools', 'Workout tracking apps', 'Nutrition guides'],
      ['Beginner workout videos', 'Basic equipment guide', 'Meal planning apps'],
      ['Intermediate training programs', 'Form check videos', 'Progress tracking'],
      ['Advanced workout plans', 'Specialized equipment', 'Performance metrics'],
      ['Competition training guides', 'Advanced nutrition', 'Recovery protocols'],
      ['Maintenance programs', 'Long-term planning', 'Injury prevention']
    ];
    
    if (phaseResources[phaseNumber - 1]) {
      resources.push(...phaseResources[phaseNumber - 1]);
    }
  }
  
  // Add preference-based resources
  if (input.preferences.includes('Audio learning')) {
    resources.push('Podcasts', 'Audiobooks', 'Audio courses');
  }
  
  if (input.preferences.includes('Online courses')) {
    resources.push('Coursera', 'Udemy', 'Khan Academy');
  }
  
  return resources.slice(0, 4); // Limit to 4 resources per phase
}

function generateResources(input: GoalInput): string[] {
  const resources: string[] = [];
  const goalLower = input.goal.toLowerCase();
  
  // Add goal-specific resources
  if (goalLower.includes('learn') || goalLower.includes('language')) {
    resources.push('Language learning apps', 'Online dictionaries', 'Grammar guides', 'Conversation practice platforms');
  }
  
  if (goalLower.includes('fitness') || goalLower.includes('weight') || goalLower.includes('exercise')) {
    resources.push('Fitness tracking apps', 'Workout videos', 'Nutrition guides', 'Exercise equipment guides');
  }
  
  if (goalLower.includes('business') || goalLower.includes('startup')) {
    resources.push('Business plan templates', 'Market research tools', 'Accounting software', 'Marketing platforms');
  }
  
  // Add preference-based resources
  if (input.preferences.includes('Books/Reading')) {
    resources.push('Recommended reading list', 'E-book platforms', 'Library resources');
  }
  
  if (input.preferences.includes('Online courses')) {
    resources.push('Course platforms', 'Certification programs', 'Skill assessments');
  }
  
  // Add budget-appropriate resources
  if (input.budget === 'low') {
    resources.push('Free online resources', 'Public library materials', 'Open-source tools');
  } else if (input.budget === 'high') {
    resources.push('Premium courses', 'Professional coaching', 'Advanced tools');
  }
  
  return resources.slice(0, 8); // Limit to 8 general resources
}

function generateCheckpoints(input: GoalInput, numPhases: number): string[] {
  const checkpoints: string[] = [];
  const goalLower = input.goal.toLowerCase();
  
  for (let i = 1; i <= numPhases; i++) {
    if (goalLower.includes('learn') || goalLower.includes('language')) {
      checkpoints.push(`Week ${i * 2}: Test vocabulary and grammar knowledge`);
    } else if (goalLower.includes('fitness') || goalLower.includes('weight') || goalLower.includes('exercise')) {
      checkpoints.push(`Week ${i * 2}: Measure fitness progress and adjust plan`);
    } else if (goalLower.includes('business') || goalLower.includes('startup')) {
      checkpoints.push(`Week ${i * 2}: Review business metrics and milestones`);
    } else {
      checkpoints.push(`Week ${i * 2}: Assess progress and adjust approach`);
    }
  }
  
  return checkpoints;
}

function generateTips(input: GoalInput): string[] {
  const tips: string[] = [];
  const goalLower = input.goal.toLowerCase();
  
  // Add general tips
  tips.push('Set up a dedicated time each day for working on your goal');
  tips.push('Track your progress regularly to stay motivated');
  tips.push('Break large tasks into smaller, manageable chunks');
  
  // Add goal-specific tips
  if (goalLower.includes('learn') || goalLower.includes('language')) {
    tips.push('Practice speaking from day one, even if you feel uncomfortable');
    tips.push('Immerse yourself in the language through media and culture');
    tips.push('Find a language exchange partner or conversation group');
  }
  
  if (goalLower.includes('fitness') || goalLower.includes('weight') || goalLower.includes('exercise')) {
    tips.push('Focus on form over intensity, especially when starting');
    tips.push('Allow adequate rest and recovery between workouts');
    tips.push('Combine exercise with proper nutrition for best results');
  }
  
  if (goalLower.includes('business') || goalLower.includes('startup')) {
    tips.push('Validate your idea with potential customers early');
    tips.push('Start small and iterate based on feedback');
    tips.push('Network with other entrepreneurs and mentors');
  }
  
  // Add constraint-based tips
  if (input.constraints.includes('Time constraints')) {
    tips.push('Use micro-learning sessions during breaks or commutes');
  }
  
  if (input.constraints.includes('Limited budget')) {
    tips.push('Look for free alternatives and community resources');
  }
  
  return tips.slice(0, 6); // Limit to 6 tips
}