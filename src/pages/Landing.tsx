import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Leaf, Heart, BrainCircuit, Activity } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-semibold text-primary">
          <Leaf className="h-8 w-8" />
          SoulMantra
        </div>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Try Demo</Link>
          </Button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your mindful space for <br className="hidden md:block"/>
            <span className="text-primary">mental wellness</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            SoulMantra is an AI-powered companion designed to help you reflect, understand your emotions, and build healthier habits in a safe, private environment.
          </p>
          <Button size="lg" className="h-14 px-8 text-lg rounded-full" asChild>
            <Link to="/login">Explore the Demo</Link>
          </Button>
        </section>

        {/* Features */}
        <section className="bg-muted py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-3xl shadow-sm border">
                <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Emotion Tracking</h3>
                <p className="text-muted-foreground">Log your daily moods and discover patterns over time with our intuitive check-ins and reflection tools.</p>
              </div>
              <div className="bg-card p-8 rounded-3xl shadow-sm border">
                <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <BrainCircuit className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">AI Companion</h3>
                <p className="text-muted-foreground">Chat with Dawn, our empathetic AI companion, to explore your feelings or simply have a guided conversation.</p>
              </div>
              <div className="bg-card p-8 rounded-3xl shadow-sm border">
                <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Activity className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Holistic Health</h3>
                <p className="text-muted-foreground">Connect your mental state to physical habits by tracking sleep, exercise, and hydration all in one place.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-12 text-center text-muted-foreground">
        <p>© 2026 SoulMantra Team. Built for holistic wellness.</p>
      </footer>
    </div>
  );
}
