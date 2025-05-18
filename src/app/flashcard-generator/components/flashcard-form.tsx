
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFlashcardsAction } from "@/lib/actions";
import type { GenerateFlashcardsOutput } from "@/ai/flows/generate-flashcards-flow";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).max(150, { message: "Topic cannot exceed 150 characters." }),
  numFlashcards: z.coerce.number().min(1, {message: "Must generate at least 1 flashcard."}).max(15, {message: "Cannot generate more than 15 flashcards."}).optional().default(5),
});

type FlashcardFormValues = z.infer<typeof formSchema>;
type Flashcard = GenerateFlashcardsOutput["flashcards"][0];

interface FlashcardWithState extends Flashcard {
  id: string;
  isFlipped: boolean;
}

export function FlashcardForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<FlashcardWithState[]>([]);
  const { toast } = useToast();

  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      numFlashcards: 5,
    },
  });

  const onSubmit: SubmitHandler<FlashcardFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedFlashcards([]);
    try {
      const result = await generateFlashcardsAction(data);
      setGeneratedFlashcards(
        result.flashcards.map((card, index) => ({
          ...card,
          id: `flashcard-${index}-${Date.now()}`, // Unique ID for key prop
          isFlipped: false,
        }))
      );
      toast({
        title: "Flashcards Generated!",
        description: `Your flashcards on "${data.topic}" are ready.`,
      });
    } catch (err) {
      console.error("Flashcard generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while generating flashcards.";
      toast({
        title: "Error Generating Flashcards",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlipCard = (id: string) => {
    setGeneratedFlashcards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, isFlipped: !card.isFlipped } : card
      )
    );
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flashcard Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mitosis, World War I Causes" {...field} />
                </FormControl>
                <FormDescription>The subject matter for your flashcards.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numFlashcards"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Flashcards</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="15" {...field} />
                </FormControl>
                <FormDescription>Between 1 and 15 flashcards.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Flashcards
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Generating your flashcards...</p>
        </div>
      )}

      {generatedFlashcards.length > 0 && !isLoading && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Your Flashcards</h2>
          <p className="text-muted-foreground mb-6">Click on a card to flip it and reveal the answer.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {generatedFlashcards.map((card) => (
              <Card
                key={card.id}
                onClick={() => handleFlipCard(card.id)}
                className={cn(
                  "cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200 aspect-[3/2] flex flex-col justify-between p-4 relative overflow-hidden",
                  card.isFlipped ? "bg-secondary/30 dark:bg-secondary/20" : "bg-card"
                )}
                data-ai-hint="flashcard"
                style={{ perspective: '1000px' }}
              >
                <div
                  className={cn(
                    "absolute inset-0 w-full h-full transition-transform duration-500 flex flex-col justify-center items-center text-center p-4 break-words",
                    "backface-hidden", // Hide back during transition
                    card.isFlipped ? "rotate-y-180" : ""
                  )}
                >
                  <CardTitle className="text-lg font-medium mb-1">Front</CardTitle>
                  <CardContent className="p-0 text-sm text-foreground/90 overflow-auto">
                    {card.front}
                  </CardContent>
                </div>
                <div
                  className={cn(
                    "absolute inset-0 w-full h-full transition-transform duration-500 flex flex-col justify-center items-center text-center p-4 break-words",
                    "backface-hidden", // Hide back during transition
                    "rotate-y-180", // Initially rotated
                    card.isFlipped ? "" : "-rotate-y-180" // Flip into view or hide
                  )}
                  style={{ transform: card.isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)' }}
                >
                  <CardTitle className="text-lg font-medium mb-1">Back</CardTitle>
                  <CardContent className="p-0 text-sm text-foreground/80 overflow-auto">
                     {card.back}
                  </CardContent>
                </div>
                <div className="absolute bottom-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <RotateCcw className="h-4 w-4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {/* Basic CSS for flip effect - ideally this would be in globals.css or a utility class */}
      <style jsx global>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .-rotate-y-180 {
          transform: rotateY(-180deg);
        }
      `}</style>
    </div>
  );
}
