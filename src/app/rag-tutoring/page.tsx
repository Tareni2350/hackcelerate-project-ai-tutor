import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RagForm } from "./components/rag-form";
import { Brain } from "lucide-react";

export default function RagTutoringPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Brain className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">RAG-Powered Tutoring</h1>
          <p className="text-muted-foreground">
            Enter a concept and provide relevant educational material to get a personalized explanation.
          </p>
        </div>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Get Explanation</CardTitle>
          <CardDescription>
            Our AI will use the provided resources to explain the concept clearly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RagForm />
        </CardContent>
      </Card>
    </div>
  );
}
