import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginDemo();
      toast({
        title: "Welcome to SoulMantra!",
        description: "You're now using the interactive demo mode.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize demo session.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Leaf className="h-12 w-12 text-primary mb-4" />
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
          Sign in to SoulMantra
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Your mindful space awaits
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  disabled 
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button className="w-full" disabled>Sign In</Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">
                  Or explore without an account
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-primary text-primary hover:bg-primary/5" 
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              {isLoading ? "Starting demo..." : "Enter Demo Session"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Demo mode stores data locally on your device for this session only. Real authentication is disabled during development.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
