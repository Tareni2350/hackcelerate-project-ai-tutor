
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
import { Loader2, Wand2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateMindmapAction } from "@/lib/actions";
import type { GenerateMindmapOutput, GenerateMindmapInput } from "@/ai/flows/generate-mindmap-flow";
import { MindMapDisplay } from "./mindmap-display"; // We'll create this next
import { GenerateMindmapInputSchema } from "@/ai/flows/generate-mindmap-flow"; // Import schema for default values

const mindmapDepthLevels = ["Overview", "Detailed"] as const;

// Use the schema for form validation and default values
const formSchema = GenerateMindmapInputSchema;
type MindmapFormValues = z.infer<typeof formSchema>;

export function MindmapForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [mindmapData, setMindmapData] = useState<GenerateMindmapOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<MindmapFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concept: "",
      depth: "Overview",
      numMainBranches: 4,
    },
  });

  const onSubmit: SubmitHandler<MindmapFormValues> = async (data) => {
    setIsLoading(true);
    setMindmapData(null);
    setError(null);
    try {
      const result = await generateMindmapAction(data);
      setMindmapData(result);
      toast({
        title: "Mind Map Generated!",
        description: `Your mind map for "${data.concept}" is ready.`,
      });
    } catch (err) {
      console.error("Mind map generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while generating the mind map.";
      setError(errorMessage);
      toast({
        title: "Error Generating Mind Map",
        description: errorMessage,
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
                <FormLabel>Core Concept</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Cellular Respiration, The American Civil War" {...field} />
                </FormControl>
                <FormDescription>The central topic for your mind map.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="depth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select detail level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mindmapDepthLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Choose "Detailed" for more sub-branches.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numMainBranches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Main Branches</FormLabel>
                  <FormControl>
                    <Input type="number" min="2" max="7" {...field} 
                           onChange={event => field.onChange(parseInt(event.target.value, 10) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Suggests 2-7 main branches.</FormDescription>
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
            Generate Mind Map
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Crafting your mind map...</p>
        </div>
      )}

      {error && !isLoading && (
         <div className="mt-6 bg-destructive/10 p-4 rounded-md">
            <div className="flex items-center text-destructive">
                <AlertCircle className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Mind Map Generation Failed</h3>
            </div>
            <p className="text-destructive/80 text-sm mt-1 ml-7">{error}</p>
        </div>
      )}

      {mindmapData && !isLoading && (
        <div className="mt-8">
          <Card className="shadow-md bg-background/70">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Mind Map for: {form.getValues().concept}</CardTitle>
              {mindmapData.summary && (
                <CardDescription className="pt-1">{mindmapData.summary}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <MindMapDisplay rootNode={mindmapData.rootNode} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
