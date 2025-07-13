# 🧺 PicnicMaker - Your Perfect Picnic Planning Companion

<div align="center">

![PicnicMaker Banner](https://img.shields.io/badge/PicnicMaker-Your%20Perfect%20Picnic%20Planner-brightgreen?style=for-the-badge&logo=picnic)

**Plan, organize, and enjoy the perfect picnic experience with AI-powered recommendations**

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](#) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage)

</div>

---

## ✨ Overview

PicnicMaker is a modern, intelligent picnic planning application that helps you create the perfect outdoor dining experience. Whether you're planning a romantic date, family gathering, or corporate event, our AI-powered system generates personalized picnic plans with everything you need for a memorable day outdoors.

### 🎯 What Makes PicnicMaker Special?

- **🌤️ Weather-Aware Planning** - Real-time weather integration for optimal picnic timing
- **🗺️ Location Intelligence** - Google Maps integration with park and venue recommendations
- **🍽️ Personalized Menus** - Dietary preferences and food style customization
- **🎮 Activity Suggestions** - Age-appropriate games and entertainment ideas
- **📋 Smart Packing Lists** - Comprehensive checklists based on your group and occasion
- **💰 Budget Management** - Cost breakdowns and money-saving tips
- **📱 Modern UI/UX** - Beautiful, responsive design that works on all devices

---

## 🚀 Features

### 📅 Smart Planning
- **Date & Time Selection** with weather forecasting
- **Location Picker** with Google Maps integration
- **Group Size Management** (adults, kids, pets)
- **Occasion-Specific Planning** (casual, romantic, birthday, corporate)

### 🍎 Food & Beverages
- **Multiple Food Styles**: Bring-your-own, potluck, catered, store-bought
- **Dietary Restrictions**: Vegetarian, vegan, gluten-free, halal, kosher, and more
- **Drink Preferences**: From water to specialty beverages
- **Recipe Suggestions** with prep time and difficulty levels

### 🎯 Activities & Entertainment
- **Age-Appropriate Games**: Frisbee, board games, hiking, photography
- **Equipment Lists**: Everything you need for each activity
- **Duration Planning**: Optimized schedules for your time frame

### 🎒 Smart Packing
- **Essential Items**: Weather-appropriate gear and safety equipment
- **Category Organization**: Food, gear, activities, safety, comfort
- **Quantity Recommendations**: Based on group size and duration

### 🌦️ Weather Integration
- **Real-time Forecasts** for your chosen location and date
- **Weather-Based Tips** and backup plan suggestions
- **Seasonal Recommendations** for optimal picnic experiences

### 💰 Budget Management
- **Cost Estimations** for different budget levels
- **Detailed Breakdowns** by category
- **Money-Saving Tips** and alternatives

---

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Lucide React for beautiful, consistent icons
- **Maps**: Google Maps JavaScript API for location services
- **Weather**: OpenWeatherMap API for real-time forecasts

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/muheeb-codes/picnicmaker.git
   cd picnicmaker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file in the root directory
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### API Keys Setup

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Maps JavaScript API
4. Create credentials (API Key)
5. Add the key to your `.env` file

#### OpenWeather API
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your API key
3. Add the key to your `.env` file

---

## 🎮 Usage

### Creating Your First Picnic Plan

1. **Enter Basic Details**
   - Select your preferred date and time
   - Choose your picnic location using the map picker
   - Specify group size (adults, children, pets)

2. **Customize Your Experience**
   - Select the occasion type
   - Choose your food preferences and dietary restrictions
   - Pick your preferred activities

3. **Review & Generate**
   - Check the weather forecast for your chosen date
   - Review your selections
   - Generate your personalized picnic plan

4. **Get Your Complete Plan**
   - View your comprehensive packing list
   - See food suggestions with recipes
   - Review the activity schedule
   - Check budget breakdown and tips

### Features Overview

- **Save & Load Plans**: Your plans are automatically saved to localStorage
- **Export Options**: Download your plan as PDF or share via email
- **Edit Plans**: Modify any aspect of your plan and regenerate
- **Weather Alerts**: Get notified about weather changes affecting your picnic

---

## 🎨 Screenshots

<div align="center">

![Picnic Input Form](https://via.placeholder.com/800x400/4ade80/ffffff?text=Picnic+Input+Form)
*Beautiful, intuitive input form with weather integration*

![Generated Plan](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Generated+Picnic+Plan)
*Comprehensive picnic plan with all details*

![Weather Display](https://via.placeholder.com/800x400/f59e0b/ffffff?text=Weather+Integration)
*Real-time weather data for optimal planning*

</div>

---

## 🏗️ Project Structure

```
planmaker/
├── src/
│   ├── components/          # React components
│   │   ├── PicnicInputForm.tsx
│   │   ├── PicnicPlanDisplay.tsx
│   │   ├── WeatherDisplay.tsx
│   │   └── LocationSelector.tsx
│   ├── services/           # API services
│   │   ├── mapsService.ts
│   │   └── weatherService.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── picnic.ts
│   │   └── weather.ts
│   ├── utils/              # Utility functions
│   │   ├── picnicPlanGenerator.ts
│   │   └── exportUtils.ts
│   └── App.tsx             # Main application component
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop the dist folder to Netlify
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ahmed** - *Full Stack Developer*

- 📧 [Email](mailto:muheebtechsec@gmail.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/muheeb-ahmed-4a7b83367/)
- 🐦 [Twitter](https://x.com/MuheebAhme2025)

---

## 🙏 Acknowledgments

- **Google Maps API** for location services
- **OpenWeatherMap** for weather data
- **Lucide React** for beautiful icons
- **Tailwind CSS** for the amazing styling framework
- **Vite** for the fast build tool
- **React Team** for the incredible framework

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/muheeb-codes/picnicmaker?style=social)
![GitHub forks](https://img.shields.io/github/forks/muheeb-codes/picnicmaker?style=social)
![GitHub issues](https://img.shields.io/github/issues/muheeb-codes/picnicmaker)
![GitHub pull requests](https://img.shields.io/github/issues-pr/muheeb-codes/picnicmaker)

---

<div align="center">

**Made with ❤️ by Ahmed**

*Planning the perfect picnic, one plan at a time*

[⬆ Back to top](#-picnicmaker---your-perfect-picnic-planning-companion)

</div> 