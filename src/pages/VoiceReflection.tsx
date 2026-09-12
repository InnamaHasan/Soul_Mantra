import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VoiceReflection() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const stopTracks = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopTracks();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startRecording = async () => {
    setError(null);
    setAudioUrl(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stopTracks();
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      setError(err.message || 'Failed to access microphone.');
      toast({ title: 'Microphone Error', description: 'Could not access the microphone.', variant: 'destructive' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    setElapsed(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Voice Reflection</h1>
        <p className="text-muted-foreground">Speak your mind freely. Audio stays on your device.</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Audio Journaling</CardTitle>
          <CardDescription>
            Sometimes it's easier to speak than to write. Record your thoughts out loud.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 bg-muted/30">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center mb-6 w-full max-w-lg">
              <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
              <p className="text-sm">{error}. Please grant microphone permissions.</p>
            </div>
          )}

          <div className="flex flex-col items-center justify-center mb-8">
            <div className={`h-32 w-32 rounded-full flex items-center justify-center border-4 mb-6 transition-colors duration-300 ${isRecording ? 'border-red-500 bg-red-100 dark:bg-red-900/30 animate-pulse' : 'border-primary/20 bg-card'}`}>
              <Mic className={`h-12 w-12 ${isRecording ? 'text-red-500' : 'text-primary'}`} />
            </div>
            
            {isRecording && (
              <p className="text-2xl font-mono text-foreground mb-2">{formatTime(elapsed)}</p>
            )}
            
            {!isRecording && !audioUrl && (
              <p className="text-muted-foreground mb-4">Click below to start recording.</p>
            )}
          </div>

          <div className="flex gap-4">
            {!isRecording && !audioUrl && (
              <Button onClick={startRecording} size="lg" className="rounded-full px-8">
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button onClick={stopRecording} size="lg" variant="destructive" className="rounded-full px-8">
                <Square className="mr-2 h-5 w-5 fill-current" /> Stop
              </Button>
            )}

            {audioUrl && !isRecording && (
              <div className="flex flex-col items-center w-full max-w-md gap-6">
                <audio controls src={audioUrl} className="w-full" />
                <div className="flex gap-4">
                  <Button variant="outline" onClick={deleteRecording} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                  <Button onClick={startRecording}>
                    <Mic className="mr-2 h-4 w-4" /> Record New
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        {audioUrl && (
          <CardFooter className="bg-primary/5 border-t p-6">
            <div className="w-full">
              <p className="text-sm font-medium text-primary flex items-center mb-2">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Analysis (Coming Soon)
              </p>
              <p className="text-sm text-muted-foreground">
                In the future, SoulMantra will transcribe your audio and analyze vocal tone to uncover deeper emotional insights.
              </p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
