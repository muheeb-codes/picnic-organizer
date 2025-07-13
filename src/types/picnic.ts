export interface PicnicInput {
  date: string;
  time: string;
  location: string;
  groupSize: {
    adults: number;
    kids: number;
    pets: number;
  };
  occasion: 'casual' | 'birthday' | 'romantic' | 'family' | 'celebration' | 'corporate';
  foodPreferences: {
    style: 'bring-your-own' | 'potluck' | 'catered' | 'store-bought';
    dietary: string[];
    drinkPreferences: string[];
  };
  activities: string[];
  transportation: 'car' | 'bike' | 'walk' | 'public-transit';
  budget: 'low' | 'medium' | 'high';
  duration: number; // in hours
  specialRequests: string[];
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'food' | 'gear' | 'activities' | 'safety' | 'comfort';
  essential: boolean;
  quantity?: string;
  notes?: string;
}

export interface FoodSuggestion {
  id: string;
  name: string;
  category: 'main' | 'side' | 'snack' | 'dessert' | 'drink';
  servings: string;
  prepTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  recipe?: string;
  tips?: string;
}

export interface Activity {
  id: string;
  name: string;
  duration: string;
  participants: string;
  equipment: string[];
  ageGroup: 'all' | 'kids' | 'adults';
  description: string;
}

export interface PicnicPlan {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  duration: number;
  groupSize: {
    adults: number;
    kids: number;
    pets: number;
  };
  occasion: string;
  summary: string;
  packingList: PackingItem[];
  foodSuggestions: FoodSuggestion[];
  activities: Activity[];
  schedule: {
    timeSlot: string;
    activity: string;
    description: string;
  }[];
  weatherTips: string[];
  safetyTips: string[];
  backupPlans: string[];
  budget: {
    estimated: string;
    breakdown: {
      category: string;
      amount: string;
    }[];
  };
  createdAt: string;
}