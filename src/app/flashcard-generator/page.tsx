
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlashcardForm } from "./components/flashcard-form";
import { Layers } from "lucide-react";

export default function FlashcardGeneratorPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Layers className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Flashcard Generator</h1>
          <p className="text-muted-foreground">
            Create custom flashcards for any topic to help you memorize key concepts.
          </p>
        </div>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate New Flashcards</CardTitle>
          <CardDescription>
            Enter a topic and the number of flashcards you need. The AI will do the rest!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FlashcardForm />
        </CardContent>
      </Card>
    </div>
  );
}
