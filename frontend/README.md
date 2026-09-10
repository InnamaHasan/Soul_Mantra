# SoulMantra Frontend

SoulMantra is an AI-powered mental wellness and self-awareness web application. This repository contains the complete interactive React frontend, built for a 4-member B.Tech team project.

## Features Included
- **Landing Page**: Modern intro to the platform.
- **Authentication**: Simulated login/demo session flow.
- **Dashboard**: Wellness score, interactive charts (Recharts), health summaries.
- **Journal**: Create, view, delete entries with mood tags.
- **Mood Check-in**: Emotion logging and interactive 4-7-8 breathing exercise.
- **Face Reflection**: Local camera capture (no data sent to server).
- **Voice Reflection**: Local audio recording (no data sent to server).
- **Assessments**: Multi-step questionnaire UI with progress tracking.
- **Health Tracker**: Sliders and inputs for sleep, water, exercise, etc.
- **Dawn Companion**: Chat interface with an AI persona.
- **Insights**: Data visualization for mood and habits.
- **Settings**: Theme toggling (Dark/Light/System) and data management.

## Tech Stack
- React 19 + Vite
- TypeScript
- Tailwind CSS v3
- shadcn/ui components
- React Router DOM
- Recharts (Data visualization)
- Framer Motion (Animations)
- Lucide React (Icons)

## Folder Structure
- `/src/components/layout`: Global layout components (Sidebar, Header).
- `/src/components/ui`: Reusable shadcn UI components.
- `/src/context`: React Context providers (Auth, Theme).
- `/src/pages`: Individual page components mapping to routes.
- `/src/services`: API adapters (currently `mockApi.ts` for demo functionality).
- `/src/types`: TypeScript interfaces for the application data models.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Transitioning to Backend

Currently, the application uses `src/services/mockApi.ts` to simulate a backend using `sessionStorage`. 

When the backend (Node.js/Python/Firebase) is ready:
1. Update `.env` with the actual API URL.
2. Replace the simulated delays in `mockApi.ts` with real `fetch` or `axios` calls to your team's API endpoints.
3. Update `AuthContext.tsx` to handle JWT tokens or Firebase Auth instead of the mock demo login.
4. Integrate the ML models for Face and Voice reflection by sending the captured media blobs to the backend inference services.
