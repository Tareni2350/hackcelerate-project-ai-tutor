import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizForm } from "./components/quiz-form";
import { Lightbulb } from "lucide-react";

export default function QuizGeneratorPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Lightbulb className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Quiz Generator</h1>
          <p className="text-muted-foreground">
            Create custom quizzes tailored to your learning path. Test your knowledge and track your progress.
          </p>
        </div>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate a New Quiz</CardTitle>
          <CardDescription>
            Specify the topic, your learning level, and the number of questions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuizForm />
        </CardContent>
      </Card>
    </div>
  );
}
