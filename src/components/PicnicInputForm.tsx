import React, { useState } from 'react';
import { Calendar, MapPin, Users, Heart, Utensils, Activity, Car, DollarSign, Clock, Plus, X, Cloud } from 'lucide-react';
import { PicnicInput, PicnicPlan } from '../types/picnic';
import { LocationData, WeatherData } from '../types/weather';
import { generatePicnicPlan } from '../utils/picnicPlanGenerator';
import { LocationSelector } from './LocationSelector';
import { WeatherDisplay } from './WeatherDisplay';
import { WeatherService } from '../services/weatherService';

interface PicnicInputFormProps {
  onPlanGenerated: (plan: PicnicPlan) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export const PicnicInputForm: React.FC<PicnicInputFormProps> = ({ 
  onPlanGenerated, 
  isGenerating, 
  setIsGenerating 
}) => {
  const [picnicInput, setPicnicInput] = useState<PicnicInput>({
    date: '',
    time: '12:00',
    location: '',
    groupSize: {
      adults: 2,
      kids: 0,
      pets: 0
    },
    occasion: 'casual',
    foodPreferences: {
      style: 'bring-your-own',
      dietary: [],
      drinkPreferences: []
    },
    activities: [],
    transportation: 'car',
    budget: 'medium',
    duration: 4,
    specialRequests: []
  });

  const [newActivity, setNewActivity] = useState('');
  const [newSpecialRequest, setNewSpecialRequest] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const commonActivities = [
    'Frisbee', 'Card games', 'Board games', 'Football', 'Soccer', 'Volleyball',
    'Hiking', 'Nature walks', 'Photography', 'Music/singing', 'Reading',
    'Kite flying', 'Badminton', 'Cornhole', 'Charades', 'Scavenger hunt'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Halal', 'Kosher',
    'Keto', 'Low-carb', 'Diabetic-friendly', 'No spicy food', 'Organic preferred'
  ];

  const drinkOptions = [
    'Water', 'Soft drinks', 'Juices', 'Sports drinks', 'Coffee', 'Tea',
    'Sparkling water', 'Lemonade', 'Iced tea', 'Energy drinks', 'Smoothies'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation || !picnicInput.date) return;

    setIsGenerating(true);
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const plan = generatePicnicPlan({
      ...picnicInput,
      location: selectedLocation.name || selectedLocation.address
    }, weatherData);
    onPlanGenerated(plan);
    setIsGenerating(false);
  };

  const handleLocationSelect = async (location: LocationData) => {
    setSelectedLocation(location);
    setPicnicInput(prev => ({ ...prev, location: location.name || location.address }));
    
    // Load weather data for the selected location
    if (picnicInput.date) {
      setIsLoadingWeather(true);
      try {
        const weather = await WeatherService.getWeatherData(location.lat, location.lng, picnicInput.date);
        setWeatherData(weather);
      } catch (error) {
        console.error('Failed to load weather data:', error);
      } finally {
        setIsLoadingWeather(false);
      }
    }
  };

  const handleDateChange = async (date: string) => {
    setPicnicInput(prev => ({ ...prev, date }));
    
    // Reload weather data if location is selected
    if (selectedLocation && date) {
      setIsLoadingWeather(true);
      try {
        const weather = await WeatherService.getWeatherData(selectedLocation.lat, selectedLocation.lng, date);
        setWeatherData(weather);
      } catch (error) {
        console.error('Failed to load weather data:', error);
      } finally {
        setIsLoadingWeather(false);
      }
    }
  };
  const addActivity = (activity: string) => {
    if (activity && !picnicInput.activities.includes(activity)) {
      setPicnicInput(prev => ({
        ...prev,
        activities: [...prev.activities, activity]
      }));
    }
  };

  const removeActivity = (activity: string) => {
    setPicnicInput(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a !== activity)
    }));
  };

  const addSpecialRequest = (request: string) => {
    if (request && !picnicInput.specialRequests.includes(request)) {
      setPicnicInput(prev => ({
        ...prev,
        specialRequests: [...prev.specialRequests, request]
      }));
    }
  };

  const removeSpecialRequest = (request: string) => {
    setPicnicInput(prev => ({
      ...prev,
      specialRequests: prev.specialRequests.filter(r => r !== request)
    }));
  };

  const toggleDietary = (dietary: string) => {
    setPicnicInput(prev => ({
      ...prev,
      foodPreferences: {
        ...prev.foodPreferences,
        dietary: prev.foodPreferences.dietary.includes(dietary)
          ? prev.foodPreferences.dietary.filter(d => d !== dietary)
          : [...prev.foodPreferences.dietary, dietary]
      }
    }));
  };

  const toggleDrink = (drink: string) => {
    setPicnicInput(prev => ({
      ...prev,
      foodPreferences: {
        ...prev.foodPreferences,
        drinkPreferences: prev.foodPreferences.drinkPreferences.includes(drink)
          ? prev.foodPreferences.drinkPreferences.filter(d => d !== drink)
          : [...prev.foodPreferences.drinkPreferences, drink]
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Plan Your Perfect Picnic
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell us about your picnic and we'll create a personalized plan with everything you need for a memorable outdoor experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">When & Where</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={picnicInput.date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={picnicInput.time}
                onChange={(e) => setPicnicInput(prev => ({ ...prev, time: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <LocationSelector
                selectedLocation={selectedLocation}
                onLocationSelect={handleLocationSelect}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (hours)
              </label>
              <input
                type="number"
                value={picnicInput.duration}
                onChange={(e) => setPicnicInput(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                min="1"
                max="12"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transportation
              </label>
              <select
                value={picnicInput.transportation}
                onChange={(e) => setPicnicInput(prev => ({ ...prev, transportation: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="walk">Walking</option>
                <option value="public-transit">Public Transit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Weather Display */}
        {weatherData && picnicInput.date && (
          <WeatherDisplay 
            weatherData={weatherData} 
            picnicDate={picnicInput.date}
          />
        )}

        {isLoadingWeather && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Loading weather forecast...</span>
            </div>
          </div>
        )}

        {/* Group Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Group Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adults
              </label>
              <input
                type="number"
                value={picnicInput.groupSize.adults}
                onChange={(e) => setPicnicInput(prev => ({ 
                  ...prev, 
                  groupSize: { ...prev.groupSize, adults: parseInt(e.target.value) } 
                }))}
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kids
              </label>
              <input
                type="number"
                value={picnicInput.groupSize.kids}
                onChange={(e) => setPicnicInput(prev => ({ 
                  ...prev, 
                  groupSize: { ...prev.groupSize, kids: parseInt(e.target.value) } 
                }))}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pets
              </label>
              <input
                type="number"
                value={picnicInput.groupSize.pets}
                onChange={(e) => setPicnicInput(prev => ({ 
                  ...prev, 
                  groupSize: { ...prev.groupSize, pets: parseInt(e.target.value) } 
                }))}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occasion
            </label>
            <select
              value={picnicInput.occasion}
              onChange={(e) => setPicnicInput(prev => ({ ...prev, occasion: e.target.value as any }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="casual">Casual Hangout</option>
              <option value="birthday">Birthday Celebration</option>
              <option value="romantic">Romantic Date</option>
              <option value="family">Family Gathering</option>
              <option value="celebration">Special Celebration</option>
              <option value="corporate">Corporate Event</option>
            </select>
          </div>
        </div>

        {/* Food Preferences */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Utensils className="w-6 h-6 text-orange-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Food & Drinks</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Style
              </label>
              <select
                value={picnicInput.foodPreferences.style}
                onChange={(e) => setPicnicInput(prev => ({ 
                  ...prev, 
                  foodPreferences: { ...prev.foodPreferences, style: e.target.value as any } 
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="bring-your-own">Bring Your Own</option>
                <option value="potluck">Potluck Style</option>
                <option value="store-bought">Store-Bought</option>
                <option value="catered">Catered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dietary Preferences
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {dietaryOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleDietary(option)}
                    className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                      picnicInput.foodPreferences.dietary.includes(option)
                        ? 'bg-green-100 border-green-300 text-green-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Drink Preferences
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {drinkOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleDrink(option)}
                    className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                      picnicInput.foodPreferences.drinkPreferences.includes(option)
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <Activity className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Activities</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose activities you'd like to include
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {commonActivities.map(activity => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => addActivity(activity)}
                    className={`p-2 text-sm rounded-lg border transition-all duration-200 ${
                      picnicInput.activities.includes(activity)
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="Add custom activity..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    addActivity(newActivity);
                    setNewActivity('');
                  }}
                  className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {picnicInput.activities.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected activities:
                </label>
                <div className="flex flex-wrap gap-2">
                  {picnicInput.activities.map(activity => (
                    <div key={activity} className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {activity}
                      <button
                        type="button"
                        onClick={() => removeActivity(activity)}
                        className="ml-2 hover:text-purple-900"
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

        {/* Budget & Special Requests */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <DollarSign className="w-6 h-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Budget & Special Requests</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                value={picnicInput.budget}
                onChange={(e) => setPicnicInput(prev => ({ ...prev, budget: e.target.value as any }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="low">Low ($0-30)</option>
                <option value="medium">Medium ($30-100)</option>
                <option value="high">High ($100+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Special Requests
              </label>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newSpecialRequest}
                  onChange={(e) => setNewSpecialRequest(e.target.value)}
                  placeholder="e.g., wheelchair accessible, shade required, no loud music..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    addSpecialRequest(newSpecialRequest);
                    setNewSpecialRequest('');
                  }}
                  className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {picnicInput.specialRequests.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special requests:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {picnicInput.specialRequests.map(request => (
                      <div key={request} className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                        {request}
                        <button
                          type="button"
                          onClick={() => removeSpecialRequest(request)}
                          className="ml-2 hover:text-indigo-900"
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isGenerating || !selectedLocation || !picnicInput.date}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Your Picnic Plan...</span>
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                <span>Create My Picnic Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};