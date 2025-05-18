
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel as ShadcnFormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label"; // Added generic Label
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateQuizAction } from "@/lib/actions";
import type { GenerateQuizFromTopicOutput } from "@/ai/flows/generate-quiz-from-topic";

const learningProgressLevels = ["Beginner", "Intermediate", "Advanced"] as const;

const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters long." }).max(100),
  learningProgress: z.enum(learningProgressLevels).optional(),
  numQuestions: z.coerce.number().min(1, { message: "Must have at least 1 question." }).max(20, { message: "Cannot exceed 20 questions."}),
});

type QuizFormValues = z.infer<typeof formSchema>;
type QuizQuestion = GenerateQuizFromTopicOutput["quizQuestions"][0];

export function QuizForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<GenerateQuizFromTopicOutput | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      learningProgress: "Beginner",
      numQuestions: 5,
    },
  });

  const handleGenerateQuiz: SubmitHandler<QuizFormValues> = async (data) => {
    setIsLoading(true);
    setQuiz(null);
    setUserAnswers({});
    setSubmitted(false);
    try {
      const result = await generateQuizAction(data);
      setQuiz(result);
      toast({
        title: "Quiz Generated!",
        description: `Your quiz on "${data.topic}" is ready.`,
      });
    } catch (err) {
      console.error("Quiz generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while generating the quiz.";
      toast({
        title: "Error Generating Quiz",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    // Optional: Calculate score or provide feedback
    let score = 0;
    quiz?.quizQuestions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        score++;
      }
    });
    toast({
      title: "Quiz Submitted!",
      description: `You scored ${score} out of ${quiz?.quizQuestions.length}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerateQuiz)} className="space-y-6">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <ShadcnFormLabel>Quiz Topic</ShadcnFormLabel>
                <FormControl>
                  <Input placeholder="e.g., World History, Basic Algebra" {...field} />
                </FormControl>
                <FormDescription>The subject matter for your quiz.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="learningProgress"
              render={({ field }) => (
                <FormItem>
                  <ShadcnFormLabel>Learning Progress</ShadcnFormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {learningProgressLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Helps tailor quiz difficulty.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <ShadcnFormLabel>Number of Questions</ShadcnFormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="20" {...field} />
                  </FormControl>
                  <FormDescription>Between 1 and 20 questions.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Quiz
          </Button>
        </form>
      </Form>

      {isLoading && !quiz && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Generating your quiz...</p>
        </div>
      )}

      {quiz && quiz.quizQuestions.length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Your Quiz on "{form.getValues().topic}"</h2>
          {quiz.quizQuestions.map((q: QuizQuestion, index: number) => (
            <Card key={index} className="shadow-md bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                <CardDescription className="pt-1 text-base">{q.question}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  value={userAnswers[index]}
                  disabled={submitted}
                  className="space-y-2"
                >
                  {q.options.map((option, optIndex) => {
                    const optionId = `q${index}-option-${optIndex}`;
                    return (
                      <div key={optIndex} className="flex items-center space-x-3 space-y-0">
                        <RadioGroupItem value={option} id={optionId} />
                        <Label
                          htmlFor={optionId}
                          className={`font-normal cursor-pointer ${
                            submitted && option === q.correctAnswer ? 'text-green-600 font-semibold' : ''
                          } ${
                            submitted && userAnswers[index] === option && option !== q.correctAnswer ? 'text-red-600 line-through' : ''
                          }`}
                        >
                          {option}
                          {submitted && option === q.correctAnswer && <CheckCircle className="inline ml-2 h-4 w-4 text-green-600" />}
                          {submitted && userAnswers[index] === option && option !== q.correctAnswer && <XCircle className="inline ml-2 h-4 w-4 text-red-600" />}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
              {submitted && (
                <CardFooter className="text-sm">
                  {userAnswers[index] === q.correctAnswer ? (
                    <p className="text-green-600 font-semibold">Correct!</p>
                  ) : (
                    <p className="text-red-600 font-semibold">Incorrect. Correct answer: {q.correctAnswer}</p>
                  )}
                </CardFooter>
              )}
            </Card>
          ))}
          {!submitted && (
            <Button onClick={handleSubmitQuiz} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              Submit Quiz
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

    
