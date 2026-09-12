import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { healthService } from '../services/mockApi';
import { HealthData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Moon, Droplets, Activity, Footprints, Smartphone, Save } from 'lucide-react';

export default function HealthTracker() {
  const [data, setData] = useState<HealthData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const todayData = await healthService.getTodayData();
    setData(todayData);
  };

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    await healthService.updateTodayData(data);
    toast({ title: 'Saved', description: 'Health metrics updated successfully.' });
    setIsSaving(false);
  };

  if (!data) return <div className="p-8 text-center text-muted-foreground">Loading your health data...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Tracker</h1>
          <p className="text-muted-foreground">Monitor physical habits that impact your mental wellbeing.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sleep */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-blue-500" />
              <CardTitle>Sleep</CardTitle>
            </div>
            <CardDescription>Goal: 8 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-foreground">{data.sleepHours} <span className="text-sm font-normal text-muted-foreground">hrs</span></span>
            </div>
            <Slider 
              value={[data.sleepHours]} 
              max={12} 
              step={0.5} 
              onValueChange={(val) => setData({...data, sleepHours: val[0]})}
              className="py-4"
            />
            <Progress value={(data.sleepHours / 8) * 100} className="h-1.5" />
          </CardContent>
        </Card>

        {/* Water */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-cyan-500" />
              <CardTitle>Hydration</CardTitle>
            </div>
            <CardDescription>Goal: 8 glasses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-foreground">{data.waterGlasses} <span className="text-sm font-normal text-muted-foreground">glasses</span></span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setData({...data, waterGlasses: Math.max(0, data.waterGlasses - 1)})}>-</Button>
                <Button variant="outline" size="icon" onClick={() => setData({...data, waterGlasses: data.waterGlasses + 1})}>+</Button>
              </div>
            </div>
            <Progress value={(data.waterGlasses / 8) * 100} className="h-1.5" />
          </CardContent>
        </Card>

        {/* Exercise */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <CardTitle>Exercise</CardTitle>
            </div>
            <CardDescription>Goal: 30 mins</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input 
                type="number" 
                value={data.exerciseMinutes} 
                onChange={(e) => setData({...data, exerciseMinutes: parseInt(e.target.value) || 0})}
                className="w-24 text-lg font-bold"
              />
              <span className="text-muted-foreground">minutes</span>
            </div>
            <Progress value={(data.exerciseMinutes / 30) * 100} className="h-1.5" />
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Footprints className="h-5 w-5 text-orange-500" />
              <CardTitle>Steps</CardTitle>
            </div>
            <CardDescription>Goal: 10,000 steps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input 
                type="number" 
                value={data.steps} 
                onChange={(e) => setData({...data, steps: parseInt(e.target.value) || 0})}
                className="w-32 text-lg font-bold"
              />
              <span className="text-muted-foreground">steps</span>
            </div>
            <Progress value={(data.steps / 10000) * 100} className="h-1.5" />
          </CardContent>
        </Card>

        {/* Screen Time */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-purple-500" />
              <CardTitle>Screen Time</CardTitle>
            </div>
            <CardDescription>Try to keep under 4 hours of non-essential screen time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-foreground">{data.screenTimeHours} <span className="text-sm font-normal text-muted-foreground">hrs</span></span>
            </div>
            <Slider 
              value={[data.screenTimeHours]} 
              max={12} 
              step={0.5} 
              onValueChange={(val) => setData({...data, screenTimeHours: val[0]})}
              className="py-4"
            />
            {/* Inverse progress: green if low, red if high */}
            <div className="h-1.5 w-full bg-secondary overflow-hidden rounded-full">
              <div 
                className={`h-full ${data.screenTimeHours > 6 ? 'bg-destructive' : data.screenTimeHours > 4 ? 'bg-yellow-500' : 'bg-primary'}`} 
                style={{ width: `${Math.min((data.screenTimeHours / 8) * 100, 100)}%` }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
