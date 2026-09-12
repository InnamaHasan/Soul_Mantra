import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, CheckCircle2, ClipboardList } from 'lucide-react';

type Question = {
  id: string;
  text: string;
  options: { value: string; label: string; score: number }[];
};

const sampleAssessment: Question[] = [
  {
    id: 'q1',
    text: 'How often have you felt overwhelmed by your daily tasks in the past week?',
    options: [
      { value: 'never', label: 'Never', score: 0 },
      { value: 'rarely', label: 'Rarely', score: 1 },
      { value: 'sometimes', label: 'Sometimes', score: 2 },
      { value: 'often', label: 'Often', score: 3 },
    ],
  },
  {
    id: 'q2',
    text: 'How would you rate your ability to bounce back from setbacks recently?',
    options: [
      { value: 'excellent', label: 'Excellent', score: 3 },
      { value: 'good', label: 'Good', score: 2 },
      { value: 'fair', label: 'Fair', score: 1 },
      { value: 'poor', label: 'Poor', score: 0 },
    ],
  },
  {
    id: 'q3',
    text: 'How frequently do you make time for activities you genuinely enjoy?',
    options: [
      { value: 'daily', label: 'Daily', score: 3 },
      { value: 'weekly', label: 'A few times a week', score: 2 },
      { value: 'rarely', label: 'Rarely', score: 1 },
      { value: 'never', label: 'Almost never', score: 0 },
    ],
  }
];

export default function Assessments() {
  const [activeAssessment, setActiveAssessment] = useState<Question[] | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const startAssessment = () => {
    setActiveAssessment(sampleAssessment);
    setCurrentStep(0);
    setAnswers({});
    setIsComplete(false);
  };

  const handleNext = () => {
    if (activeAssessment && currentStep < activeAssessment.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    if (!activeAssessment) return 0;
    return activeAssessment.reduce((total, q) => {
      const selectedValue = answers[q.id];
      const option = q.options.find(o => o.value === selectedValue);
      return total + (option?.score || 0);
    }, 0);
  };

  if (isComplete && activeAssessment) {
    const score = calculateScore();
    const maxScore = activeAssessment.length * 3;
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-10">
        <Card className="text-center p-6 border-primary/20">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">Assessment Complete</CardTitle>
          <CardDescription className="text-base mb-6">
            Thank you for taking the time to reflect on your wellbeing.
          </CardDescription>
          
          <div className="bg-muted rounded-xl p-6 mb-8 text-left">
            <h4 className="font-semibold mb-2 text-primary">Your Reflection Score: {score} / {maxScore} ({percentage}%)</h4>
            <p className="text-sm text-muted-foreground">
              This score is a simple reflection tool to help you gauge your current stress and resilience levels. 
              Higher scores generally indicate better coping mechanisms and lower stress.
            </p>
          </div>
          
          <Button onClick={() => setActiveAssessment(null)} className="w-full sm:w-auto">
            Return to Assessments
          </Button>
        </Card>
      </div>
    );
  }

  if (activeAssessment) {
    const question = activeAssessment[currentStep];
    const progress = ((currentStep) / activeAssessment.length) * 100;
    const hasAnsweredCurrent = !!answers[question.id];

    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentStep + 1} of {activeAssessment.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">{question.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[question.id] || ''} 
              onValueChange={(val) => setAnswers({...answers, [question.id]: val})}
              className="space-y-4 mt-4"
            >
              {question.options.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-3 space-y-0 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setAnswers({...answers, [question.id]: opt.value})}>
                  <RadioGroupItem value={opt.value} id={opt.value} />
                  <Label htmlFor={opt.value} className="flex-1 cursor-pointer font-normal text-base">{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between pt-6 border-t mt-6">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={handleNext} disabled={!hasAnsweredCurrent}>
              {currentStep === activeAssessment.length - 1 ? 'Finish' : 'Next'} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground">Standardized tools to help you evaluate your mental wellbeing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Assessment */}
        <Card className="flex flex-col border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="h-10 w-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center mb-4">
              <ClipboardList className="h-5 w-5" />
            </div>
            <CardTitle>General Self-Reflection</CardTitle>
            <CardDescription>A brief 3-question survey to evaluate your current stress levels and resilience.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• 3 questions</p>
              <p>• Takes ~1 minute</p>
              <p>• Non-clinical</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={startAssessment}>Start Assessment</Button>
          </CardFooter>
        </Card>

        {/* PHQ-9 Placeholder */}
        <Card className="flex flex-col opacity-70">
          <CardHeader>
            <div className="h-10 w-10 bg-muted text-muted-foreground rounded-lg flex items-center justify-center mb-4">
              <ClipboardList className="h-5 w-5" />
            </div>
            <CardTitle>PHQ-9 (Depression)</CardTitle>
            <CardDescription>Patient Health Questionnaire for assessing severity of depression.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• 9 questions</p>
              <p>• Clinical standard</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-4">Note: Requires backend clinical module configuration.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>Coming Soon</Button>
          </CardFooter>
        </Card>

        {/* PCL-5 Placeholder */}
        <Card className="flex flex-col opacity-70">
          <CardHeader>
            <div className="h-10 w-10 bg-muted text-muted-foreground rounded-lg flex items-center justify-center mb-4">
              <ClipboardList className="h-5 w-5" />
            </div>
            <CardTitle>PCL-5 (PTSD)</CardTitle>
            <CardDescription>PTSD Checklist for DSM-5 to monitor symptom severity.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• 20 questions</p>
              <p>• Clinical standard</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-4">Note: Requires backend clinical module configuration.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>Coming Soon</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-muted p-6 rounded-xl border text-sm text-muted-foreground">
        <strong>Disclaimer:</strong> SoulMantra provides these assessments for self-reflection and informational purposes only. 
        They are not diagnostic tools and do not replace professional medical advice, diagnosis, or treatment. 
        If you are in distress, please contact emergency services or a healthcare provider immediately.
      </div>
    </div>
  );
}
