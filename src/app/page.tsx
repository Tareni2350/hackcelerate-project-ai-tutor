import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Volume2, Lightbulb, Archive } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "RAG-Powered Tutoring",
      description: "Get instant, customized explanations using advanced Retrieval-Augmented Generation.",
      icon: <Brain className="h-8 w-8 text-primary" />,
      link: "/rag-tutoring",
      cta: "Explore RAG Tutor"
    },
    {
      title: "Voice-Based Tutoring",
      description: "Listen to explanations in a natural, human-like tone, sensitive to your mood.",
      icon: <Volume2 className="h-8 w-8 text-primary" />,
      link: "/voice-tutoring",
      cta: "Try Voice Tutor"
    },
    {
      title: "Gamified Learning Path",
      description: "Custom quizzes tailored to your progress, making learning engaging.",
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      link: "/quiz-generator",
      cta: "Generate a Quiz"
    },
    {
      title: "Offline Knowledge Cache",
      description: "Access key educational content and examples even without an internet connection.",
      icon: <Archive className="h-8 w-8 text-primary" />,
      link: "/offline-cache",
      cta: "View Offline Content"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
                  {feature.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <footer className="mt-16 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} EduAI. Revolutionizing education with AI.</p>
      </footer>
    </div>
  );
}
