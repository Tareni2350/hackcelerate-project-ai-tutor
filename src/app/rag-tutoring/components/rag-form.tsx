"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getRagExplanationAction } from "@/lib/actions";
import type { GenerateExplanationFromRagOutput } from "@/ai/flows/generate-explanation-from-rag";

const formSchema = z.object({
  concept: z.string().min(3, { message: "Concept must be at least 3 characters long." }).max(200),
  educationalResource: z.string().min(10, { message: "Educational resource must be at least 10 characters long." }).max(5000),
});

type RagFormValues = z.infer<typeof formSchema>;

export function RagForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<GenerateExplanationFromRagOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<RagFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concept: "",
      educationalResource: "",
    },
  });

  const onSubmit: SubmitHandler<RagFormValues> = async (data) => {
    setIsLoading(true);
    setExplanation(null);
    try {
      const result = await getRagExplanationAction(data);
      setExplanation(result);
      toast({
        title: "Explanation Generated",
        description: "The AI has provided an explanation for your concept.",
      });
    } catch (error) {
      console.error("RAG explanation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate explanation. Please try again.",
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
            name="concept"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concept</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Photosynthesis, Quantum Entanglement" {...field} />
                </FormControl>
                <FormDescription>
                  The topic or concept you want to understand.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="educationalResource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Educational Resource</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste relevant text from your textbook, lecture notes, or articles here..."
                    className="min-h-[150px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide context for the AI to generate a tailored explanation.
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
            Get Explanation
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Generating explanation...</p>
        </div>
      )}

      {explanation && (
        <Card className="mt-8 shadow-md bg-background/70">
          <CardHeader>
            <CardTitle className="text-xl text-primary">AI Generated Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert whitespace-pre-wrap">
              {explanation.explanation}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
