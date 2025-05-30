// src/components/landing/anomaly-detection-card.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, Zap } from 'lucide-react';
import { generateAnomalyDescription, type GenerateAnomalyDescriptionInput } from '@/ai/flows/generate-anomaly-description';
import { useToast } from '@/hooks/use-toast';
import { useScrollFadeIn } from '@/hooks/use-scroll-fade-in';

export default function AnomalyDetectionCard() {
  const [activitySummary, setActivitySummary] = useState(
    "User X logged in at 2 AM, accessed critical financial data, and attempted to export large files. User Y showed unusually high login frequency from multiple IPs."
  );
  const [teamBehaviorNorms, setTeamBehaviorNorms] = useState(
    "Team members typically work between 9 AM and 6 PM. Access to financial data is restricted and requires dual approval. Large file exports are rare and require justification."
  );
  const [anomalyDescription, setAnomalyDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const sectionRef = useScrollFadeIn();

  const handleSubmit = async () => {
    setIsLoading(true);
    setAnomalyDescription('');

    const input: GenerateAnomalyDescriptionInput = {
      activitySummary,
      teamBehaviorNorms,
    };

    try {
      const result = await generateAnomalyDescription(input);
      setAnomalyDescription(result.anomalyDescription);
      toast({
        title: "Analysis Complete",
        description: "Anomaly description generated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating anomaly description:", error);
      toast({
        title: "Error",
        description: "Failed to generate anomaly description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      ref={sectionRef as React.RefObject<HTMLElement>} 
      className="fade-in-section py-16 md:py-24"
    >
      <div className="container mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl bg-card border-border/50">
          <CardHeader className="text-center">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="font-headline text-2xl sm:text-3xl text-card-foreground">AI-Powered Anomaly Detection</CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Let TRACKERLY's AI analyze activity patterns and highlight potential risks for managers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="activitySummary" className="font-medium text-card-foreground">Observed Activity Summary</Label>
              <Textarea
                id="activitySummary"
                value={activitySummary}
                onChange={(e) => setActivitySummary(e.target.value)}
                placeholder="Enter a summary of user activity..."
                rows={4}
                className="bg-secondary/30 border-border/70 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamBehaviorNorms" className="font-medium text-card-foreground">Team Behavior Norms</Label>
              <Textarea
                id="teamBehaviorNorms"
                value={teamBehaviorNorms}
                onChange={(e) => setTeamBehaviorNorms(e.target.value)}
                placeholder="Describe normal team behavior..."
                rows={3}
                 className="bg-secondary/30 border-border/70 text-foreground"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-4">
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AlertCircle className="mr-2 h-4 w-4" />
              )}
              Analyze Activity
            </Button>
            {anomalyDescription && (
              <div className="w-full p-4 border border-primary/50 rounded-md bg-primary/10">
                <h4 className="font-semibold text-lg mb-2 text-primary">Anomaly Report:</h4>
                <p className="text-sm text-card-foreground whitespace-pre-wrap">{anomalyDescription}</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
