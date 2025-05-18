
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Wand2, RefreshCw, CheckSquare, BookCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateFlashcardsAction } from "@/lib/actions";
import type { GenerateFlashcardsOutput, GenerateFlashcardsInput } from "@/ai/flows/generate-flashcards-flow";
import { cn } from "@/lib/utils";

const difficultyLevels = ["Basic", "Intermediate", "Advanced"] as const;

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).max(150, { message: "Topic cannot exceed 150 characters." }),
  numFlashcards: z.coerce.number().min(1, {message: "Must generate at least 1 flashcard."}).max(15, {message: "Cannot generate more than 15 flashcards."}).optional().default(5),
  difficultyLevel: z.enum(difficultyLevels).optional().default("Basic"),
});

type FlashcardFormValues = z.infer<typeof formSchema>;
type Flashcard = GenerateFlashcardsOutput["flashcards"][0];

interface DisplayFlashcard extends Flashcard {
  uid: string;
}

export function FlashcardForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [displayedFlashcards, setDisplayedFlashcards] = useState<DisplayFlashcard[]>([]);
  const [doneFlashcards, setDoneFlashcards] = useState<DisplayFlashcard[]>([]);
  const [activeDialogCard, setActiveDialogCard] = useState<DisplayFlashcard | null>(null);
  const [isDialogCardFlipped, setIsDialogCardFlipped] = useState(false);
  const { toast } = useToast();

  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      numFlashcards: 5,
      difficultyLevel: "Basic",
    },
  });

  const onSubmit: SubmitHandler<FlashcardFormValues> = async (data) => {
    setIsLoading(true);
    setDisplayedFlashcards([]);
    setDoneFlashcards([]); // Clear done cards when generating a new set
    setActiveDialogCard(null);
    try {
      const result = await generateFlashcardsAction(data);
      setDisplayedFlashcards(
        result.flashcards.map((card, index) => ({
          ...card,
          uid: `flashcard-${index}-${Date.now()}`, 
        }))
      );
      toast({
        title: "Flashcards Generated!",
        description: `Your flashcards on "${data.topic}" (${data.difficultyLevel}) are ready.`,
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

  const handleOpenCardInDialog = (card: DisplayFlashcard) => {
    setActiveDialogCard(card);
    setIsDialogCardFlipped(false);
  };

  const handleFlipDialogCard = () => {
    setIsDialogCardFlipped((prev) => !prev);
  };

  const handleMarkCardAsDone = () => {
    if (activeDialogCard) {
      setDoneFlashcards((prevDoneCards) => [...prevDoneCards, activeDialogCard]);
      setDisplayedFlashcards((prevCards) =>
        prevCards.filter((card) => card.uid !== activeDialogCard.uid)
      );
      toast({
        title: "Card Done!",
        description: `"${activeDialogCard.front.substring(0,30)}..." marked as done.`,
        duration: 2000,
      });
      setActiveDialogCard(null);
    }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <FormField
              control={form.control}
              name="difficultyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose the appropriate difficulty.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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

      {displayedFlashcards.length > 0 && !isLoading && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Your Flashcards</h2>
          <p className="text-muted-foreground mb-6">Click on a card to study it. ({displayedFlashcards.length} remaining)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {displayedFlashcards.map((card) => (
              <Card
                key={card.uid}
                onClick={() => handleOpenCardInDialog(card)}
                className="cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200 aspect-[3/2] flex flex-col justify-center items-center text-center p-4 bg-card overflow-hidden"
                data-ai-hint="flashcard education"
              >
                <CardTitle className="text-lg font-medium mb-1">Front</CardTitle>
                <CardContent className="p-0 text-sm text-foreground/90 overflow-auto">
                  {card.front}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeDialogCard && (
        <Dialog open={!!activeDialogCard} onOpenChange={(isOpen) => { if (!isOpen) setActiveDialogCard(null); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary">
                Study Flashcard: {isDialogCardFlipped ? "Back" : "Front"}
              </DialogTitle>
              <CardDescription>Topic: {form.getValues().topic}</CardDescription>
            </DialogHeader>
            <div className="my-4 p-4 min-h-[150px] bg-muted/50 rounded-md flex items-center justify-center text-center">
              <p className="text-lg">
                {isDialogCardFlipped ? activeDialogCard.back : activeDialogCard.front}
              </p>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={handleFlipDialogCard} className="mb-2 sm:mb-0">
                <RefreshCw className="mr-2 h-4 w-4" />
                Flip Card
              </Button>
              <Button onClick={handleMarkCardAsDone} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <CheckSquare className="mr-2 h-4 w-4" />
                Mark as Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {displayedFlashcards.length === 0 && !isLoading && form.formState.isSubmitted && (
         <div className="mt-8 text-center">
            <p className="text-lg font-semibold text-muted-foreground">All flashcards studied for this set!</p>
            <Button onClick={() => form.handleSubmit(onSubmit)()} className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New Set
            </Button>
        </div>
      )}

      {doneFlashcards.length > 0 && !isLoading && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-4 flex items-center">
            <BookCheck className="mr-2 h-6 w-6" /> Reviewed Flashcards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {doneFlashcards.map((card) => (
              <Card
                key={`done-${card.uid}`}
                className="shadow-sm p-3 bg-card/70 opacity-80"
                data-ai-hint="reviewed flashcard"
              >
                <CardTitle className="text-sm font-medium mb-1 text-foreground/80">Front</CardTitle>
                <CardContent className="p-0 text-xs text-muted-foreground overflow-auto max-h-20">
                  {card.front}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
