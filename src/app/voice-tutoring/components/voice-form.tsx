
"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mic, Play, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getVoiceExplanationAction } from "@/lib/actions";
import type { GenerateHumanLikeVoiceExplanationOutput } from "@/ai/flows/generate-human-like-voice-explanation";

const moods = ["Neutral", "Curious", "Stressed", "Confused", "Excited"] as const;

const formSchema = z.object({
  concept: z.string().min(3, { message: "Concept must be at least 3 characters long." }).max(200),
  studentMood: z.enum(moods).optional(),
});

type VoiceFormValues = z.infer<typeof formSchema>;

export function VoiceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<GenerateHumanLikeVoiceExplanationOutput | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);
  const { toast } = useToast();

  const form = useForm<VoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concept: "",
      studentMood: "Neutral",
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisSupported(true);
    }
    // Global cleanup for speech synthesis on component unmount
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const onSubmit: SubmitHandler<VoiceFormValues> = async (data) => {
    setIsLoading(true);
    setExplanation(null); // Clear previous explanation
    // Stop any ongoing speech before generating new one
    if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    try {
      const result = await getVoiceExplanationAction(data);
      setExplanation(result);
      toast({
        title: "Voice Explanation Generated",
        description: "The AI has prepared an explanation.",
      });
    } catch (error) {
      console.error("Voice explanation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate voice explanation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for automatic playback when a new explanation is set
  useEffect(() => {
    if (explanation && explanation.explanation && speechSynthesisSupported && typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel any previous speech first
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(explanation.explanation);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        if (event.error === 'interrupted') {
          console.info('Speech synthesis for auto-play was interrupted.', event);
        } else {
          console.error('Speech synthesis error during auto-play:', event.error, event);
          toast({
            title: "Speech Playback Error",
            description: `Could not auto-play: ${event.error || 'Unknown error'}`,
            variant: "destructive",
          });
        }
      };
      window.speechSynthesis.speak(utterance);
    }

    // Cleanup: if the explanation changes or component unmounts while speaking, stop it.
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false); 
      }
    };
  }, [explanation, speechSynthesisSupported, toast]);


  const handlePlayExplanation = useCallback(() => {
    if (!explanation || !explanation.explanation || !speechSynthesisSupported || typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(explanation.explanation);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      if (event.error === 'interrupted') {
        console.info('Speech synthesis for manual play was interrupted.', event);
      } else {
        console.error('Speech synthesis error on manual play:', event.error, event);
        toast({
          title: "Speech Playback Error",
          description: `Could not play: ${event.error || 'Unknown error'}`,
          variant: "destructive",
        });
      }
    };
    window.speechSynthesis.speak(utterance);
  }, [explanation, speechSynthesisSupported, isSpeaking, toast]);


  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="concept"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concept to Explain</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., The Water Cycle, Newton's Laws of Motion" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the concept you want the AI to explain.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentMood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Current Mood (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {moods.map((mood) => (
                      <SelectItem key={mood} value={mood}>
                        {mood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  The AI will try to adjust its tone based on your mood.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mic className="mr-2 h-4 w-4" />
            )}
            Generate Explanation
          </Button>
        </form>
      </Form>

      {isLoading && !explanation && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Generating explanation...</p>
        </div>
      )}

      {explanation && (
        <Card className="mt-8 shadow-md bg-background/70">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <Mic className="mr-2 h-5 w-5" /> AI Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert whitespace-pre-wrap">
              {explanation.explanation}
            </div>
            {speechSynthesisSupported && (
              <Button
                onClick={handlePlayExplanation}
                disabled={isLoading || !explanation.explanation} // Disable if no explanation text
                variant="outline"
                className="mt-4"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="mr-2 h-4 w-4" /> Stop Listening
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Listen to Explanation
                  </>
                )}
              </Button>
            )}
             {!speechSynthesisSupported && typeof window !== 'undefined' && (
              <p className="mt-4 text-sm text-muted-foreground italic">
                Your browser does not support speech synthesis for voice playback.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
