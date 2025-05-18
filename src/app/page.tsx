
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Volume2, Gamepad2, Camera, Archive, FileText } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "Interactive RAG Explanations",
      description: "Our AI uses Retrieval-Augmented Generation to pull relevant info from your learning materials, providing explanations tailored to your understanding.",
      icon: <Brain className="h-8 w-8 text-primary" />,
      link: "/rag-tutoring",
      cta: "Explore RAG Tutor"
    },
    {
      title: "Empathetic Voice Tutor",
      description: "Learn through natural, human-like voice explanations that adapt to your mood, offering encouragement to keep you motivated.",
      icon: <Volume2 className="h-8 w-8 text-primary" />,
      link: "/voice-tutoring",
      cta: "Try Voice Tutor"
    },
    {
      title: "Gamified Quiz Challenges",
      description: "Test your knowledge with custom quizzes, track your progress, and stay motivated with an engaging, game-like learning experience.",
      icon: <Gamepad2 className="h-8 w-8 text-primary" />,
      link: "/quiz-generator",
      cta: "Take a Quiz Challenge"
    },
    {
      title: "Instant Photo Solver",
      description: "Stuck on a textbook problem? Snap a photo and get immediate, step-by-step explanations from your AI tutor.",
      icon: <Camera className="h-8 w-8 text-primary" />,
      link: "/photo-solver", 
      cta: "Snap & Solve"
    },
    {
      title: "Essay Checker",
      description: "Get AI-powered feedback on your essays for grammar, clarity, and paraphrasing opportunities to improve your writing.",
      icon: <FileText className="h-8 w-8 text-primary" />,
      link: "/essay-checker",
      cta: "Review Your Essay"
    },
    {
      title: "Offline Learning Access",
      description: "Access key educational content and solved examples even without an internet connection, ensuring your learning never stops.",
      icon: <Archive className="h-8 w-8 text-primary" />,
      link: "/offline-cache",
      cta: "Explore Offline Cache"
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary mb-4">Welcome To AI Tutor</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your personal AI-powered tutor, designed to make learning interactive, personalized, and effective.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-start gap-4 pb-4">
              {feature.icon}
              <div>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
                <CardDescription className="text-md mt-1">{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Link href={feature.link} passHref className="w-full">
                <Button className="w-full mt-4">
                  {feature.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <footer className="mt-16 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} AI Tutor. Revolutionizing education with AI.</p>
      </footer>
    </div>
  );
}
