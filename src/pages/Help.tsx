import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, LifeBuoy } from 'lucide-react';

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <LifeBuoy className="h-8 w-8 text-primary" /> Help & Support
        </h1>
        <p className="text-muted-foreground">Understanding SoulMantra's modules and limitations.</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg flex items-start gap-3 border border-blue-200 dark:border-blue-800">
        <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-sm">Important Medical Disclaimer</p>
          <p className="text-sm opacity-90 mt-1">
            SoulMantra is a tool for self-reflection and personal growth. It is <strong>not</strong> a medical device, a diagnostic tool, or a substitute for professional mental health care. 
            If you are experiencing a mental health emergency, experiencing thoughts of self-harm, or need immediate assistance, please call your local emergency services (e.g., 911, 988) or go to the nearest hospital immediately.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Guide</CardTitle>
          <CardDescription>Learn how to use the different features of SoulMantra.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* I'll need to install accordion from shadcn, wait, I didn't install accordion. I'll just use standard HTML details or simple layout */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Journaling</h3>
              <p className="text-muted-foreground text-sm">
                Use the journal to free-write your thoughts. You can tag each entry with a mood to see how your writing correlates with your emotional state. Future updates will include AI analysis to highlight recurring themes in your entries.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Mood Check-in & Breathing</h3>
              <p className="text-muted-foreground text-sm">
                Log your daily emotions quickly. Use the built-in 4-7-8 breathing exercise whenever you feel anxious or need to center yourself. The visual pacing ring will guide you through the inhale, hold, and exhale phases.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Face & Voice Reflection</h3>
              <p className="text-muted-foreground text-sm">
                These multimedia modules offer alternative ways to journal. The Face Reflection acts as a visual mirror for your current state, while Voice Reflection lets you speak freely when typing feels burdensome. All media stays local to your device in this demo.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Dawn AI Companion</h3>
              <p className="text-muted-foreground text-sm">
                Dawn is an conversational interface designed to provide a listening ear. In this demo, Dawn provides scripted empathetic responses.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo Limitations</CardTitle>
          <CardDescription>What to expect in this version.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li><strong>Data Storage:</strong> All data is stored in your browser's session storage. If you refresh the page or close the tab, your data will be lost.</li>
            <li><strong>Authentication:</strong> The login system is simulated. No real credentials are required or stored.</li>
            <li><strong>AI Features:</strong> Advanced ML features (like facial expression analysis or vocal tone detection) are represented by placeholders and require backend integration.</li>
            <li><strong>Exporting:</strong> The PDF report export function is currently disabled.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
