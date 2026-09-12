import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FaceReflection() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);

  const startCamera = async () => {
    setError(null);
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to access camera.');
      toast({ title: 'Camera Error', description: 'Could not access the camera.', variant: 'destructive' });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const clearPhoto = () => {
    setCapturedImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Face Reflection</h1>
        <p className="text-muted-foreground">Capture your expression for private reflection. Images are not sent anywhere.</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Visual Journaling</CardTitle>
          <CardDescription>
            Sometimes our faces say what words cannot. Use this tool to capture how you look in this moment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 bg-muted/30">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center mb-6 w-full max-w-lg">
              <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
              <p className="text-sm">{error}. Please ensure you have granted camera permissions.</p>
            </div>
          )}

          <div className="relative w-full max-w-lg aspect-video bg-black rounded-xl overflow-hidden border-2 border-border shadow-sm mb-6 flex items-center justify-center">
            {!stream && !capturedImage && (
              <div className="text-center p-6">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Camera is currently inactive.</p>
                <Button onClick={startCamera}>Grant Access & Start Camera</Button>
              </div>
            )}
            
            {stream && !capturedImage && (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            )}

            {capturedImage && (
              <img src={capturedImage} alt="Captured reflection" className="w-full h-full object-cover" />
            )}
            
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex gap-4">
            {stream && !capturedImage && (
              <Button onClick={capturePhoto} size="lg" className="rounded-full">
                <Camera className="mr-2 h-5 w-5" /> Capture Expression
              </Button>
            )}

            {capturedImage && (
              <>
                <Button variant="outline" onClick={clearPhoto}>Clear</Button>
                <Button onClick={startCamera}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Retake
                </Button>
              </>
            )}
          </div>
        </CardContent>
        {capturedImage && (
          <CardFooter className="bg-primary/5 border-t p-6">
            <div className="w-full">
              <p className="text-sm font-medium text-primary flex items-center mb-2">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Analysis (Coming Soon)
              </p>
              <p className="text-sm text-muted-foreground">
                In the future, SoulMantra will analyze facial micro-expressions to help you better understand subtle emotional states.
              </p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
