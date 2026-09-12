import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Download, Calendar, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

const moodDistribution = [
  { mood: 'Happy', count: 12 },
  { mood: 'Calm', count: 15 },
  { mood: 'Neutral', count: 8 },
  { mood: 'Sad', count: 4 },
  { mood: 'Anxious', count: 6 },
  { mood: 'Angry', count: 1 },
];

const habitCorrelation = [
  { subject: 'Sleep Quality', A: 80, fullMark: 100 },
  { subject: 'Hydration', A: 60, fullMark: 100 },
  { subject: 'Exercise', A: 45, fullMark: 100 },
  { subject: 'Mood', A: 75, fullMark: 100 },
  { subject: 'Journaling', A: 90, fullMark: 100 },
];

export default function Insights() {
  const [timeRange, setTimeRange] = useState('30d');
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Generating PDF...",
      description: "Your report will download shortly.",
    });
    // Placeholder for actual PDF generation
    setTimeout(() => {
      toast({ title: "Demo Mode", description: "PDF export is disabled in demo mode." });
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights & Reports</h1>
          <p className="text-muted-foreground">Discover patterns in your wellness data.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg flex items-start gap-3 border border-blue-200 dark:border-blue-800">
        <Info className="h-5 w-5 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-sm">Sample Analytics View</p>
          <p className="text-sm opacity-90">
            The charts below currently display sample data to demonstrate the analytics capabilities. 
            Once backend integration is complete, these will reflect your actual saved data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>Frequency of emotions logged in this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="mood" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Habit & Wellness Correlation</CardTitle>
            <CardDescription>How different areas of your life balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={habitCorrelation}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="You" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle>AI Reflection Summary</CardTitle>
            <CardDescription>Generated based on your journal entries and mood logs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              "Over the past month, you've shown a strong correlation between getting 8+ hours of sleep and reporting a 'Calm' or 'Happy' mood the following day. 
              However, on days with less than 6 hours of sleep, anxiety reports increased by 40%. 
              Your journaling consistency has improved, providing a healthy outlet for stress. 
              Consider maintaining your current evening routine as it appears to be highly beneficial for your overall wellbeing."
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
