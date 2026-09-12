import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Mood from './pages/Mood';
import FaceReflection from './pages/FaceReflection';
import VoiceReflection from './pages/VoiceReflection';
import Assessments from './pages/Assessments';
import HealthTracker from './pages/HealthTracker';
import Chat from './pages/Chat';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Help from './pages/Help';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="soulmantra-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/welcome" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="journal" element={<Journal />} />
              <Route path="mood" element={<Mood />} />
              <Route path="face" element={<FaceReflection />} />
              <Route path="voice" element={<VoiceReflection />} />
              <Route path="assessments" element={<Assessments />} />
              <Route path="health" element={<HealthTracker />} />
              <Route path="chat" element={<Chat />} />
              <Route path="insights" element={<Insights />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
