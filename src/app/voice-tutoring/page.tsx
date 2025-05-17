import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceForm } from "./components/voice-form";
import { Volume2 } from "lucide-react";

export default function VoiceTutoringPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Volume2 className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Voice-Based Tutoring</h1>
          <p className="text-muted-foreground">
            Get explanations in a natural, human-like tone. The AI adapts to your selected mood.
          </p>
        </div>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate Voice Explanation</CardTitle>
          <CardDescription>
            Specify a concept and your current mood for a tailored audio (text-based for now) explanation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VoiceForm />
        </CardContent>
      </Card>
    </div>
  );
}
