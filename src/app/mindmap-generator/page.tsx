
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MindmapForm } from "./components/mindmap-form";
import { BrainCircuit } from "lucide-react";

export default function MindMapGeneratorPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <BrainCircuit className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Mind Map Generator</h1>
          <p className="text-muted-foreground">
            Visually organize complex concepts with an AI-generated mind map.
          </p>
        </div>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Create a New Mind Map</CardTitle>
          <CardDescription>
            Enter a concept, and the AI will generate a structured mind map to help you understand its components and relationships.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MindmapForm />
        </CardContent>
      </Card>
    </div>
  );
}
