export type User = {
  id: string;
  name: string;
  email: string;
  isDemo: boolean;
};

export type Mood = 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'angry' | 'tired';

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  date: string;
  moodTag: Mood | null;
  wordCount: number;
};

export type HealthData = {
  date: string;
  sleepHours: number;
  waterGlasses: number;
  exerciseMinutes: number;
  steps: number;
  screenTimeHours: number;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
};

export type AssessmentResult = {
  id: string;
  type: 'PHQ-9' | 'PCL-5' | 'Self-Reflection';
  score: number;
  date: string;
  answers: Record<string, any>;
};
