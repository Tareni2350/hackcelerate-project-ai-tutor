
"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, Wand2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { solvePhotoProblemAction } from "@/lib/actions";
import type { SolvePhotoProblemOutput } from "@/ai/flows/solve-photo-problem-flow";

export function PhotoSolverForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState<SolvePhotoProblemOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [problemContext, setProblemContext] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null); // Clear previous errors
      setExplanation(null); // Clear previous explanation
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !previewUrl) {
      toast({
        title: "No Image Selected",
        description: "Please select an image file first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setExplanation(null);

    try {
      // The previewUrl is already the data URI
      const result = await solvePhotoProblemAction({
        photoDataUri: previewUrl,
        problemContext: problemContext || undefined,
      });
      setExplanation(result);
      toast({
        title: "Explanation Generated",
        description: "The AI has provided an explanation for your problem.",
      });
    } catch (err) {
      console.error("Photo solving error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: `Failed to get explanation: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="photo-upload">Upload Problem Image</Label>
        <Input
          id="photo-upload"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-2"
          disabled={isLoading}
        >
          <UploadCloud className="h-5 w-5" />
          {selectedFile ? `Selected: ${selectedFile.name}` : "Choose an Image (PNG, JPG, WebP < 5MB)"}
        </Button>
      </div>

      {previewUrl && (
        <div className="mt-4 p-4 border rounded-md shadow-sm bg-muted/50 relative aspect-video max-h-[400px] flex items-center justify-center overflow-hidden">
          <Image 
            src={previewUrl} 
            alt="Problem preview" 
            layout="fill"
            objectFit="contain" 
            className="rounded-md"
            data-ai-hint="problem image"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="problem-context">Optional: Add Context</Label>
        <Textarea
          id="problem-context"
          placeholder="e.g., 'This is from my Algebra 2 homework, chapter on quadratics.' or 'What are the steps to simplify this expression?'"
          value={problemContext}
          onChange={(e) => setProblemContext(e.target.value)}
          className="min-h-[100px]"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Providing context can help the AI give a more relevant explanation.
        </p>
      </div>

      <Button onClick={handleSubmit} disabled={isLoading || !selectedFile} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Get Explanation
      </Button>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Analyzing your image and generating explanation...</p>
        </div>
      )}

      {error && !isLoading && (
         <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Generating Explanation</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {explanation && !isLoading && (
        <Card className="mt-8 shadow-md bg-background/70">
          <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
              <ImageIcon className="mr-2 h-5 w-5" /> AI Generated Explanation
            </CardTitle>
            {explanation.identifiedProblemType && (
              <CardDescription>Identified Problem Type: {explanation.identifiedProblemType}</CardDescription>
            )}
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
