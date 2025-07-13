export interface GoalInput {
  goal: string;
  deadline: string;
  timeFrame: 'days' | 'weeks' | 'months';
  availableTime: number;
  timeUnit: 'minutes' | 'hours';
  preferences: string[];
  constraints: string[];
  budget: 'low' | 'medium' | 'high';
  intensity: 'low' | 'medium' | 'high';
  style: 'structured' | 'flexible' | 'intensive';
}

export interface ActionStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  actions: ActionStep[];
  milestone: string;
  resources: string[];
}

export interface Plan {
  id: string;
  title: string;
  goal: string;
  totalDuration: string;
  createdAt: string;
  phases: Phase[];
  resources: string[];
  checkpoints: string[];
  tips: string[];
}