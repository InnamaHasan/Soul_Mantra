import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { moodService } from '../services/mockApi';
import { Mood as MoodType } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Smile, Frown, Meh, Play, Pause, RotateCcw, HeartPulse } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const moods = [
  { id: 'happy', label: 'Happy', color: 'bg-green-500', icon: Smile },
  { id: 'calm', label: 'Calm', color: 'bg-blue-400', icon: Smile },
  { id: 'neutral', label: 'Neutral', color: 'bg-gray-400', icon: Meh },
  { id: 'sad', label: 'Sad', color: 'bg-indigo-400', icon: Frown },
  { id: 'anxious', label: 'Anxious', color: 'bg-amber-500', icon: Frown },
  { id: 'angry', label: 'Angry', color: 'bg-red-500', icon: Frown },
  { id: 'tired', label: 'Tired', color: 'bg-slate-500', icon: Meh },
];

export default function Mood() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [breathingPhase, setBreathingPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathTimer, setBreathTimer] = useState(0);
  const controls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogMood = async () => {
    if (!selectedMood) return;
    setIsSubmitting(true);
    await moodService.logMood(selectedMood, note);
    toast({ title: 'Mood Logged', description: 'Your current mood has been recorded.' });
    setSelectedMood(null);
    setNote('');
    setIsSubmitting(false);
  };

  const startBreathing = () => {
    setBreathingPhase('inhale');
    controls.start({ scale: 1.5, transition: { duration: 4, ease: "easeInOut" } });
    
    let time = 0;
    timerRef.current = setInterval(() => {
      time += 1;
      setBreathTimer(time);
      if (time === 4) {
        setBreathingPhase('hold');
      } else if (time === 11) {
        setBreathingPhase('exhale');
        controls.start({ scale: 1, transition: { duration: 8, ease: "easeInOut" } });
      } else if (time >= 19) {
        time = 0;
        setBreathingPhase('inhale');
        controls.start({ scale: 1.5, transition: { duration: 4, ease: "easeInOut" } });
      }
    }, 1000);
  };

  const stopBreathing = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setBreathingPhase('idle');
    setBreathTimer(0);
    controls.start({ scale: 1, transition: { duration: 1 } });
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mood & Reflection</h1>
        <p className="text-muted-foreground">Check in with yourself and find a moment of peace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling?</CardTitle>
              <CardDescription>Select the emotion that best describes your current state.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {moods.map((m) => {
                  const Icon = m.icon;
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id as MoodType)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        isSelected ? `border-primary bg-primary/10` : `border-transparent bg-muted hover:bg-accent`
                      }`}
                      style={{ width: '100px', height: '100px' }}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white mb-2 ${m.color} ${isSelected ? 'ring-4 ring-primary/30' : ''}`}>
                        <Icon size={20} />
                      </div>
                      <span className="text-sm font-medium">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {selectedMood && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Add a note (optional)</label>
                    <Textarea 
                      placeholder="What's contributing to this feeling?" 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="resize-none h-24"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleLogMood}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging...' : 'Save Check-in'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HeartPulse className="mr-2 h-5 w-5 text-primary" /> 
                Guided Breathing
              </CardTitle>
              <CardDescription>4-7-8 method to reduce anxiety and promote sleep.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-10">
              <div className="relative h-48 w-48 flex items-center justify-center mb-8">
                <motion.div
                  animate={controls}
                  initial={{ scale: 1 }}
                  className="absolute inset-0 bg-primary/20 rounded-full"
                />
                <div className="z-10 h-32 w-32 bg-primary/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/30 shadow-lg">
                  <div className="text-center text-primary font-medium">
                    {breathingPhase === 'idle' && 'Ready'}
                    {breathingPhase === 'inhale' && 'Breathe In'}
                    {breathingPhase === 'hold' && 'Hold'}
                    {breathingPhase === 'exhale' && 'Breathe Out'}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                {breathingPhase === 'idle' ? (
                  <Button onClick={startBreathing} className="w-32 rounded-full">
                    <Play className="mr-2 h-4 w-4" /> Start
                  </Button>
                ) : (
                  <Button onClick={stopBreathing} variant="outline" className="w-32 rounded-full text-destructive hover:bg-destructive hover:text-white">
                    <RotateCcw className="mr-2 h-4 w-4" /> Stop
                  </Button>
                )}
              </div>
              
              {breathingPhase !== 'idle' && (
                <p className="text-sm text-muted-foreground mt-6 animate-pulse">
                  {breathingPhase === 'inhale' && 'Inhale deeply through your nose for 4 seconds'}
                  {breathingPhase === 'hold' && 'Hold your breath for 7 seconds'}
                  {breathingPhase === 'exhale' && 'Exhale completely through your mouth for 8 seconds'}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
