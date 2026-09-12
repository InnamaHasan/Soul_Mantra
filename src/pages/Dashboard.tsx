import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Activity, BookHeart, Droplets, Moon, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { healthService } from '../services/mockApi';
import { HealthData } from '../types';

const trendData = [
  { name: 'Mon', mood: 4, sleep: 7 },
  { name: 'Tue', mood: 3, sleep: 6 },
  { name: 'Wed', mood: 5, sleep: 8 },
  { name: 'Thu', mood: 4, sleep: 7.5 },
  { name: 'Fri', mood: 5, sleep: 8 },
  { name: 'Sat', mood: 5, sleep: 9 },
  { name: 'Sun', mood: 4, sleep: 7.5 },
];

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];

export default function Dashboard() {
  const { user } = useAuth();
  const [health, setHealth] = useState<HealthData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const h = await healthService.getTodayData();
      setHealth(h);
    };
    loadData();
  }, []);

  const wellnessScore = 78;
  const pieData = [
    { name: 'Score', value: wellnessScore },
    { name: 'Remaining', value: 100 - wellnessScore },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good morning, {user?.name?.split(' ')[0] || 'Friend'}</h1>
          <p className="text-muted-foreground mt-1">Here is your wellness overview for today.</p>
        </div>
        <Button asChild>
          <Link to="/mood">Log Mood <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wellness Score */}
        <Card className="col-span-1 md:col-span-1">
          <CardHeader>
            <CardTitle>Wellness Indicator</CardTitle>
            <CardDescription>Your overall score today</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="hsl(var(--primary))" />
                    <Cell fill="hsl(var(--muted))" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold text-primary">{wellnessScore}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground mt-4">
              You're doing great! Keeping up with your hydration helped your score today.
            </p>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
            <CardDescription>Mood and sleep correlation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="hsl(var(--primary))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2, 210 40% 50%))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Mood (1-5)" />
                  <Line yAxisId="right" type="monotone" dataKey="sleep" stroke="hsl(var(--chart-2, 210 40% 50%))" strokeWidth={3} dot={{ r: 4 }} name="Sleep (hrs)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Moon className="h-8 w-8 text-blue-500 mb-3" />
            <h4 className="text-2xl font-bold">{health?.sleepHours || 0}h</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Sleep</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Droplets className="h-8 w-8 text-cyan-500 mb-3" />
            <h4 className="text-2xl font-bold">{health?.waterGlasses || 0}</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Water Glasses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Activity className="h-8 w-8 text-green-500 mb-3" />
            <h4 className="text-2xl font-bold">{health?.exerciseMinutes || 0}m</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Exercise</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <BookHeart className="h-8 w-8 text-pink-500 mb-3" />
            <h4 className="text-2xl font-bold">1</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Journal Entry</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 whitespace-normal h-auto py-6" asChild>
              <Link to="/chat">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <span>Chat with Dawn</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 whitespace-normal h-auto py-6" asChild>
              <Link to="/journal">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <BookHeart className="h-6 w-6" />
                </div>
                <span>Write Journal</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 whitespace-normal h-auto py-6" asChild>
              <Link to="/health">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <span>Update Health</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 whitespace-normal h-auto py-6" asChild>
              <Link to="/assessments">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <span>Take Assessment</span>
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest check-ins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Logged Health Metrics</p>
                <p className="text-xs text-muted-foreground">Today at 8:00 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center text-pink-600 dark:text-pink-300 shrink-0">
                <BookHeart className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Created Journal Entry "Morning thoughts"</p>
                <p className="text-xs text-muted-foreground">Yesterday at 9:30 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
