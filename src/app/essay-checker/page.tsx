
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EssayCheckerForm } from "./components/essay-checker-form";
import { FileText } from "lucide-react";

export default function EssayCheckerPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <FileText className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Essay Checker</h1>
          <p className="text-muted-foreground">
            Submit your essay for grammatical analysis and paraphrasing suggestions.
          </p>
        </div>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Review Your Essay</CardTitle>
          <CardDescription>
            Paste your essay text below. The AI will provide feedback on grammar and suggest ways to rephrase sentences for clarity and impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EssayCheckerForm />
        </CardContent>
      </Card>
    </div>
  );
}
