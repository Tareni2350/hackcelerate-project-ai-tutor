
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, AlertCircle, CheckSquare, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkEssayAction } from "@/lib/actions";
import type { CheckEssayOutput } from "@/ai/flows/check-essay-flow";

const formSchema = z.object({
  essayText: z.string().min(50, { message: "Essay text must be at least 50 characters." }).max(10000, { message: "Essay text cannot exceed 10,000 characters." }),
});

type EssayFormValues = z.infer<typeof formSchema>;

export function EssayCheckerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<CheckEssayOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<EssayFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      essayText: "",
    },
  });

  const onSubmit: SubmitHandler<EssayFormValues> = async (data) => {
    setIsLoading(true);
    setFeedback(null);
    setError(null);
    try {
      const result = await checkEssayAction(data);
      setFeedback(result);
      toast({
        title: "Essay Feedback Generated",
        description: "The AI has reviewed your essay.",
      });
    } catch (err) {
      console.error("Essay checking error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to get essay feedback: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="essayText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Essay</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your essay here. Minimum 50 characters."
                    className="min-h-[200px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  The AI will analyze this text for grammar and paraphrasing opportunities.
                </FormDescription>
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
            Check Essay
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Analyzing your essay...</p>
        </div>
      )}

      {error && !isLoading && (
         <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Generating Feedback</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {feedback && !isLoading && (
        <div className="mt-8 space-y-6">
          <Card className="shadow-md bg-background/70">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Overall Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="prose prose-sm sm:prose-base max-w-none dark:prose-invert whitespace-pre-wrap">
                {feedback.overallFeedback}
              </p>
            </CardContent>
          </Card>

          {feedback.grammaticalErrors && feedback.grammaticalErrors.length > 0 && (
            <Card className="shadow-md bg-background/70">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <CheckSquare className="mr-2 h-5 w-5" /> Grammatical Error Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedback.grammaticalErrors.map((item, index) => (
                  <Card key={`grammar-${index}`} className="bg-card/50 p-4 shadow-sm">
                    <p className="text-sm text-muted-foreground">Original: "<span className="italic">{item.originalText}</span>"</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">Suggested: "<span className="italic">{item.suggestedCorrection}</span>"</p>
                    <p className="text-xs text-muted-foreground mt-1">Explanation: {item.explanation}</p>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {feedback.paraphrasingSuggestions && feedback.paraphrasingSuggestions.length > 0 && (
            <Card className="shadow-md bg-background/70">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <Edit3 className="mr-2 h-5 w-5" /> Paraphrasing Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedback.paraphrasingSuggestions.map((item, index) => (
                  <Card key={`paraphrase-${index}`} className="bg-card/50 p-4 shadow-sm">
                     <p className="text-sm text-muted-foreground">Original: "<span className="italic">{item.originalSentence}</span>"</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Suggested: "<span className="italic">{item.suggestedParaphrase}</span>"</p>
                    <p className="text-xs text-muted-foreground mt-1">Reason: {item.reason}</p>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
