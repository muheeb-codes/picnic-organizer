import { PicnicInput, PicnicPlan, PackingItem, FoodSuggestion, Activity } from '../types/picnic';
import { WeatherData } from '../types/weather';
import { WeatherService } from '../services/weatherService';

export function generatePicnicPlan(input: PicnicInput, weatherData?: WeatherData | null): PicnicPlan {
  const planId = `picnic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const totalGuests = input.groupSize.adults + input.groupSize.kids;
  
  return {
    id: planId,
    title: `${input.occasion === 'casual' ? 'Casual' : 
            input.occasion === 'birthday' ? 'Birthday' : 
            input.occasion === 'romantic' ? 'Romantic' : 
            input.occasion === 'family' ? 'Family' : 
            input.occasion === 'celebration' ? 'Celebration' : 'Corporate'} Picnic`,
    date: input.date,
    time: input.time,
    location: input.location,
    duration: input.duration,
    groupSize: input.groupSize,
    occasion: input.occasion,
    summary: generateSummary(input),
    packingList: generatePackingList(input),
    foodSuggestions: generateFoodSuggestions(input),
    activities: generateActivities(input),
    schedule: generateSchedule(input),
    weatherTips: generateWeatherTips(input, weatherData),
    safetyTips: generateSafetyTips(input),
    backupPlans: generateBackupPlans(input),
    budget: generateBudget(input),
    createdAt: new Date().toISOString()
  };
}

function generateSummary(input: PicnicInput): string {
  const totalGuests = input.groupSize.adults + input.groupSize.kids;
  const occasionText = input.occasion === 'casual' ? 'relaxed outdoor gathering' : 
                      input.occasion === 'birthday' ? 'birthday celebration' : 
                      input.occasion === 'romantic' ? 'romantic picnic' : 
                      input.occasion === 'family' ? 'family picnic' : 
                      input.occasion === 'celebration' ? 'special celebration' : 'corporate event';
  
  return `Join us for a wonderful ${occasionText} at ${input.location} on ${new Date(input.date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })} starting at ${input.time}. We'll have ${totalGuests} ${totalGuests === 1 ? 'person' : 'people'} enjoying ${input.duration} hours of outdoor fun with ${input.activities.length > 0 ? input.activities.join(', ') : 'various activities'}. ${input.foodPreferences.style === 'potluck' ? 'Everyone will bring something delicious to share!' : input.foodPreferences.style === 'bring-your-own' ? 'We\'ll prepare our own tasty treats!' : 'Food will be provided for everyone to enjoy!'} ${input.groupSize.pets > 0 ? `Our ${input.groupSize.pets} furry friend${input.groupSize.pets === 1 ? '' : 's'} will be joining us too!` : ''}`;
}

function generatePackingList(input: PicnicInput): PackingItem[] {
  const items: PackingItem[] = [];
  const totalGuests = input.groupSize.adults + input.groupSize.kids;
  
  // Essential items
  items.push(
    { id: 'blanket', name: 'Picnic blanket', category: 'gear', essential: true, quantity: '1-2 large blankets' },
    { id: 'cooler', name: 'Cooler with ice', category: 'gear', essential: true, quantity: '1 large cooler' },
    { id: 'water', name: 'Water bottles', category: 'food', essential: true, quantity: `${totalGuests * 2} bottles` },
    { id: 'sunscreen', name: 'Sunscreen', category: 'safety', essential: true, quantity: 'SPF 30+' },
    { id: 'first-aid', name: 'First aid kit', category: 'safety', essential: true },
    { id: 'trash-bags', name: 'Trash bags', category: 'gear', essential: true, quantity: '3-4 bags' },
    { id: 'wet-wipes', name: 'Wet wipes', category: 'comfort', essential: true, quantity: '2-3 packs' }
  );

  // Food-related items
  if (input.foodPreferences.style !== 'catered') {
    items.push(
      { id: 'plates', name: 'Plates', category: 'food', essential: true, quantity: `${totalGuests} plates` },
      { id: 'cups', name: 'Cups', category: 'food', essential: true, quantity: `${totalGuests} cups` },
      { id: 'utensils', name: 'Utensils', category: 'food', essential: true, quantity: `${totalGuests} sets` },
      { id: 'napkins', name: 'Napkins', category: 'food', essential: true, quantity: '2-3 packs' },
      { id: 'cutting-board', name: 'Cutting board', category: 'food', essential: false },
      { id: 'knife', name: 'Sharp knife', category: 'food', essential: false },
      { id: 'serving-spoons', name: 'Serving spoons', category: 'food', essential: false }
    );
  }

  // Activity-based items
  input.activities.forEach(activity => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes('frisbee')) {
      items.push({ id: 'frisbee', name: 'Frisbee', category: 'activities', essential: false });
    }
    if (activityLower.includes('ball') || activityLower.includes('football') || activityLower.includes('soccer')) {
      items.push({ id: 'ball', name: 'Ball', category: 'activities', essential: false });
    }
    if (activityLower.includes('cards') || activityLower.includes('card')) {
      items.push({ id: 'cards', name: 'Playing cards', category: 'activities', essential: false });
    }
    if (activityLower.includes('music')) {
      items.push({ id: 'speaker', name: 'Bluetooth speaker', category: 'activities', essential: false });
    }
    if (activityLower.includes('kite')) {
      items.push({ id: 'kite', name: 'Kite', category: 'activities', essential: false });
    }
  });

  // Weather and comfort items
  items.push(
    { id: 'umbrella', name: 'Umbrella/Pop-up tent', category: 'comfort', essential: false, notes: 'For shade or rain' },
    { id: 'chairs', name: 'Folding chairs', category: 'comfort', essential: false, quantity: `${Math.min(totalGuests, 4)} chairs` },
    { id: 'insect-repellent', name: 'Insect repellent', category: 'safety', essential: false },
    { id: 'hand-sanitizer', name: 'Hand sanitizer', category: 'safety', essential: true }
  );

  // Transportation-specific items
  if (input.transportation !== 'car') {
    items.push({ id: 'backpack', name: 'Backpack', category: 'gear', essential: true, notes: 'For easy carrying' });
  }

  // Pet-related items
  if (input.groupSize.pets > 0) {
    items.push(
      { id: 'pet-leash', name: 'Pet leash', category: 'gear', essential: true },
      { id: 'pet-water', name: 'Pet water bowl', category: 'food', essential: true },
      { id: 'pet-waste-bags', name: 'Pet waste bags', category: 'gear', essential: true },
      { id: 'pet-treats', name: 'Pet treats', category: 'food', essential: false }
    );
  }

  // Kids-specific items
  if (input.groupSize.kids > 0) {
    items.push(
      { id: 'kids-games', name: 'Kids games/toys', category: 'activities', essential: false },
      { id: 'kids-snacks', name: 'Kid-friendly snacks', category: 'food', essential: false },
      { id: 'diaper-bag', name: 'Diaper bag (if needed)', category: 'comfort', essential: false }
    );
  }

  return items;
}

function generateFoodSuggestions(input: PicnicInput): FoodSuggestion[] {
  const suggestions: FoodSuggestion[] = [];
  const totalGuests = input.groupSize.adults + input.groupSize.kids;
  const isVegetarian = input.foodPreferences.dietary.includes('Vegetarian');
  const isVegan = input.foodPreferences.dietary.includes('Vegan');
  const isGlutenFree = input.foodPreferences.dietary.includes('Gluten-free');

  // Main dishes
  if (input.foodPreferences.style === 'bring-your-own' || input.foodPreferences.style === 'potluck') {
    if (!isVegan) {
      suggestions.push({
        id: 'sandwiches',
        name: 'Assorted sandwiches',
        category: 'main',
        servings: `${totalGuests} sandwiches`,
        prepTime: '30 minutes',
        difficulty: 'easy',
        recipe: 'Mix of turkey, ham, and veggie sandwiches with various breads',
        tips: 'Wrap individually in parchment paper'
      });
    }
    
    if (isVegetarian || isVegan) {
      suggestions.push({
        id: 'veggie-wraps',
        name: 'Veggie wraps',
        category: 'main',
        servings: `${totalGuests} wraps`,
        prepTime: '20 minutes',
        difficulty: 'easy',
        recipe: 'Hummus, vegetables, and greens in tortillas',
        tips: 'Use colorful vegetables for visual appeal'
      });
    }

    suggestions.push({
      id: 'pasta-salad',
      name: 'Pasta salad',
      category: 'main',
      servings: `${Math.ceil(totalGuests / 4)} pounds pasta`,
      prepTime: '45 minutes',
      difficulty: 'medium',
      recipe: 'Cold pasta with vegetables, dressing, and herbs',
      tips: 'Make ahead for better flavor'
    });
  }

  // Side dishes
  suggestions.push(
    {
      id: 'potato-salad',
      name: 'Potato salad',
      category: 'side',
      servings: `${totalGuests} servings`,
      prepTime: '1 hour',
      difficulty: 'medium',
      recipe: 'Classic creamy potato salad with eggs and celery',
      tips: 'Keep chilled until serving'
    },
    {
      id: 'coleslaw',
      name: 'Coleslaw',
      category: 'side',
      servings: `${totalGuests} servings`,
      prepTime: '15 minutes',
      difficulty: 'easy',
      recipe: 'Fresh cabbage slaw with tangy dressing',
      tips: 'Drain excess liquid before serving'
    },
    {
      id: 'fruit-salad',
      name: 'Fresh fruit salad',
      category: 'side',
      servings: `${totalGuests} servings`,
      prepTime: '20 minutes',
      difficulty: 'easy',
      recipe: 'Seasonal mixed fruits with light dressing',
      tips: 'Add citrus juice to prevent browning'
    }
  );

  // Snacks
  suggestions.push(
    {
      id: 'chips-dip',
      name: 'Chips and dip',
      category: 'snack',
      servings: `${totalGuests} servings`,
      prepTime: '5 minutes',
      difficulty: 'easy',
      recipe: 'Tortilla chips with salsa and guacamole',
      tips: 'Keep dips in cooler until serving'
    },
    {
      id: 'veggie-tray',
      name: 'Vegetable tray',
      category: 'snack',
      servings: `${totalGuests} servings`,
      prepTime: '15 minutes',
      difficulty: 'easy',
      recipe: 'Fresh cut vegetables with ranch dip',
      tips: 'Cut vegetables the night before'
    },
    {
      id: 'cheese-crackers',
      name: 'Cheese and crackers',
      category: 'snack',
      servings: `${totalGuests} servings`,
      prepTime: '10 minutes',
      difficulty: 'easy',
      recipe: 'Assorted cheeses with crackers',
      tips: 'Keep cheese cold until serving'
    }
  );

  // Desserts
  suggestions.push(
    {
      id: 'brownies',
      name: 'Brownies',
      category: 'dessert',
      servings: `${totalGuests} pieces`,
      prepTime: '1 hour',
      difficulty: 'medium',
      recipe: 'Fudgy chocolate brownies cut into squares',
      tips: 'Transport in the baking pan'
    },
    {
      id: 'cookies',
      name: 'Cookies',
      category: 'dessert',
      servings: `${totalGuests * 2} cookies`,
      prepTime: '2 hours',
      difficulty: 'medium',
      recipe: 'Chocolate chip or oatmeal cookies',
      tips: 'Store in airtight container'
    },
    {
      id: 'watermelon',
      name: 'Fresh watermelon',
      category: 'dessert',
      servings: `${totalGuests} servings`,
      prepTime: '10 minutes',
      difficulty: 'easy',
      recipe: 'Cubed fresh watermelon',
      tips: 'Perfect for hot weather'
    }
  );

  // Drinks
  const drinkPrefs = input.foodPreferences.drinkPreferences;
  if (drinkPrefs.includes('Lemonade')) {
    suggestions.push({
      id: 'lemonade',
      name: 'Fresh lemonade',
      category: 'drink',
      servings: `${totalGuests} glasses`,
      prepTime: '15 minutes',
      difficulty: 'easy',
      recipe: 'Fresh squeezed lemon juice with sugar and water',
      tips: 'Bring in insulated pitcher'
    });
  }
  
  if (drinkPrefs.includes('Iced tea')) {
    suggestions.push({
      id: 'iced-tea',
      name: 'Iced tea',
      category: 'drink',
      servings: `${totalGuests} glasses`,
      prepTime: '30 minutes',
      difficulty: 'easy',
      recipe: 'Sweetened black tea served over ice',
      tips: 'Brew strong to account for ice dilution'
    });
  }

  suggestions.push({
    id: 'water-infused',
    name: 'Infused water',
    category: 'drink',
    servings: `${totalGuests} servings`,
    prepTime: '10 minutes',
    difficulty: 'easy',
    recipe: 'Water with cucumber, mint, or fruit',
    tips: 'Prepare in large dispensers'
  });

  return suggestions;
}

function generateActivities(input: PicnicInput): Activity[] {
  const activities: Activity[] = [];
  const totalGuests = input.groupSize.adults + input.groupSize.kids;
  const hasKids = input.groupSize.kids > 0;

  input.activities.forEach(activityName => {
    const activityLower = activityName.toLowerCase();
    
    if (activityLower.includes('frisbee')) {
      activities.push({
        id: 'frisbee',
        name: 'Frisbee',
        duration: '30-45 minutes',
        participants: '2-8 people',
        equipment: ['Frisbee'],
        ageGroup: 'all',
        description: 'Classic outdoor throwing game perfect for all skill levels'
      });
    }
    
    if (activityLower.includes('cards') || activityLower.includes('card')) {
      activities.push({
        id: 'card-games',
        name: 'Card games',
        duration: '20-60 minutes',
        participants: '2-6 people',
        equipment: ['Playing cards'],
        ageGroup: 'all',
        description: 'Various card games suitable for different group sizes'
      });
    }
    
    if (activityLower.includes('music')) {
      activities.push({
        id: 'music',
        name: 'Music and singing',
        duration: '30+ minutes',
        participants: 'All',
        equipment: ['Bluetooth speaker', 'Playlist'],
        ageGroup: 'all',
        description: 'Background music or group singing for atmosphere'
      });
    }
    
    if (activityLower.includes('nature') || activityLower.includes('walk')) {
      activities.push({
        id: 'nature-walk',
        name: 'Nature walk',
        duration: '30-45 minutes',
        participants: 'All',
        equipment: ['Comfortable shoes'],
        ageGroup: 'all',
        description: 'Explore the surrounding area and enjoy nature'
      });
    }
    
    if (activityLower.includes('ball') || activityLower.includes('football') || activityLower.includes('soccer')) {
      activities.push({
        id: 'ball-games',
        name: 'Ball games',
        duration: '45-60 minutes',
        participants: '4-10 people',
        equipment: ['Ball'],
        ageGroup: 'all',
        description: 'Various ball games including catch, soccer, or football'
      });
    }
    
    if (activityLower.includes('reading')) {
      activities.push({
        id: 'reading',
        name: 'Reading time',
        duration: '30+ minutes',
        participants: 'Individual',
        equipment: ['Books', 'Comfortable seating'],
        ageGroup: 'all',
        description: 'Quiet time for personal reading and relaxation'
      });
    }
    
    if (activityLower.includes('photography')) {
      activities.push({
        id: 'photography',
        name: 'Photography',
        duration: '30+ minutes',
        participants: 'All',
        equipment: ['Camera or phone'],
        ageGroup: 'all',
        description: 'Capture memories and beautiful nature scenes'
      });
    }
    
    if (activityLower.includes('kite')) {
      activities.push({
        id: 'kite-flying',
        name: 'Kite flying',
        duration: '30-45 minutes',
        participants: '1-4 people',
        equipment: ['Kite'],
        ageGroup: 'all',
        description: 'Fun activity if there\'s enough wind and open space'
      });
    }
    
    if (activityLower.includes('scavenger')) {
      activities.push({
        id: 'scavenger-hunt',
        name: 'Scavenger hunt',
        duration: '45-60 minutes',
        participants: '4+ people',
        equipment: ['List of items', 'Bags'],
        ageGroup: hasKids ? 'kids' : 'all',
        description: 'Search for specific items in nature or around the area'
      });
    }
    
    if (activityLower.includes('charades')) {
      activities.push({
        id: 'charades',
        name: 'Charades',
        duration: '30-45 minutes',
        participants: '4+ people',
        equipment: ['None'],
        ageGroup: 'all',
        description: 'Classic acting game perfect for groups'
      });
    }
  });

  // Add default activities if none were specified
  if (activities.length === 0) {
    activities.push(
      {
        id: 'relaxation',
        name: 'Relaxation time',
        duration: '60+ minutes',
        participants: 'All',
        equipment: ['Blanket', 'Comfortable setting'],
        ageGroup: 'all',
        description: 'Enjoy good conversation and peaceful outdoor time'
      },
      {
        id: 'people-watching',
        name: 'People watching',
        duration: '30+ minutes',
        participants: 'All',
        equipment: ['None'],
        ageGroup: 'all',
        description: 'Observe and enjoy the activity around you'
      }
    );
  }

  return activities;
}

function generateSchedule(input: PicnicInput): Array<{timeSlot: string, activity: string, description: string}> {
  const schedule = [];
  const startTime = new Date(`2000-01-01T${input.time}`);
  const duration = input.duration;
  
  // Arrival and setup
  schedule.push({
    timeSlot: formatTime(startTime),
    activity: 'Arrival & Setup',
    description: 'Arrive at location, set up blankets and unpack supplies'
  });
  
  // First activity/food
  const firstActivity = new Date(startTime.getTime() + 30 * 60000);
  if (input.foodPreferences.style === 'potluck') {
    schedule.push({
      timeSlot: formatTime(firstActivity),
      activity: 'Food Setup',
      description: 'Everyone sets up their potluck contributions'
    });
  } else {
    schedule.push({
      timeSlot: formatTime(firstActivity),
      activity: 'Snacks & Socializing',
      description: 'Light snacks and getting everyone comfortable'
    });
  }
  
  // Main meal
  const mealTime = new Date(startTime.getTime() + (duration * 0.4) * 60 * 60000);
  schedule.push({
    timeSlot: formatTime(mealTime),
    activity: 'Main Meal',
    description: 'Enjoy the main food and drinks together'
  });
  
  // Activities
  if (input.activities.length > 0) {
    const activityTime = new Date(startTime.getTime() + (duration * 0.6) * 60 * 60000);
    schedule.push({
      timeSlot: formatTime(activityTime),
      activity: 'Activities',
      description: `Time for ${input.activities.slice(0, 2).join(' and ')}`
    });
  }
  
  // Wrap up
  const endTime = new Date(startTime.getTime() + (duration - 0.5) * 60 * 60000);
  schedule.push({
    timeSlot: formatTime(endTime),
    activity: 'Cleanup & Wrap Up',
    description: 'Pack up belongings and clean the area'
  });
  
  return schedule;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

function generateWeatherTips(input: PicnicInput, weatherData?: WeatherData | null): string[] {
  // If we have weather data, use it to generate specific tips
  if (weatherData && input.date) {
    return WeatherService.generateWeatherTips(weatherData, input.date);
  }
  
  // Fallback to generic tips
  const tips = [
    'Check the weather forecast the day before your picnic',
    'Bring sunscreen and apply regularly, especially during midday',
    'Pack extra layers in case temperature changes',
    'Consider bringing a pop-up tent or umbrella for shade',
    'If rain is expected, have an indoor backup plan ready'
  ];
  
  return tips;
}

function generateSafetyTips(input: PicnicInput): string[] {
  const tips = [
    'Bring a first aid kit with basic supplies',
    'Keep food at proper temperatures to prevent spoilage',
    'Bring hand sanitizer and use before eating',
    'Stay hydrated throughout the day',
    'Be aware of your surroundings and any park rules'
  ];
  
  if (input.groupSize.kids > 0) {
    tips.push('Keep an eye on children around water or busy areas');
    tips.push('Bring extra snacks and water for kids');
  }
  
  if (input.groupSize.pets > 0) {
    tips.push('Keep pets on leash and clean up after them');
    tips.push('Bring water for pets and check that they don\'t overheat');
  }
  
  tips.push('Use insect repellent if bugs are common in the area');
  
  return tips;
}

function generateBackupPlans(input: PicnicInput): string[] {
  const plans = [
    'If weather is bad, consider moving to a covered pavilion in the park',
    'Have indoor alternatives ready like a restaurant or someone\'s home',
    'Bring cards or indoor games in case outdoor activities aren\'t possible',
    'Consider postponing if severe weather is forecasted'
  ];
  
  if (input.occasion === 'birthday' || input.occasion === 'celebration') {
    plans.push('Have a backup indoor venue reserved if possible');
  }
  
  return plans;
}

function generateBudget(input: PicnicInput): { estimated: string, breakdown: Array<{category: string, amount: string}> } {
  const totalGuests = input.groupSize.adults + input.groupSize.kids;
  let totalCost = 0;
  const breakdown = [];
  
  // Base costs
  let foodCost = 0;
  let gearCost = 0;
  let miscCost = 0;
  
  switch (input.budget) {
    case 'low':
      foodCost = totalGuests * 8;
      gearCost = 15;
      miscCost = 10;
      break;
    case 'medium':
      foodCost = totalGuests * 15;
      gearCost = 30;
      miscCost = 20;
      break;
    case 'high':
      foodCost = totalGuests * 25;
      gearCost = 50;
      miscCost = 30;
      break;
  }
  
  // Adjust for food style
  if (input.foodPreferences.style === 'potluck') {
    foodCost = foodCost * 0.6; // Reduced cost for potluck
  } else if (input.foodPreferences.style === 'catered') {
    foodCost = foodCost * 1.5; // Increased cost for catering
  }
  
  totalCost = foodCost + gearCost + miscCost;
  
  breakdown.push(
    { category: 'Food & Drinks', amount: `$${Math.round(foodCost)}` },
    { category: 'Gear & Supplies', amount: `$${Math.round(gearCost)}` },
    { category: 'Miscellaneous', amount: `$${Math.round(miscCost)}` }
  );
  
  return {
    estimated: `$${Math.round(totalCost)}`,
    breakdown
  };
}