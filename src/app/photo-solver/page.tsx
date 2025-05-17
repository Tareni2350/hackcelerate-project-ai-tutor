
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhotoSolverForm } from "./components/photo-solver-form";
import { Camera } from "lucide-react";

export default function PhotoSolverPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Camera className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Instant Photo Solver</h1>
          <p className="text-muted-foreground">
            Upload an image of a problem and let our AI provide a step-by-step explanation.
          </p>
        </div>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Upload Your Problem</CardTitle>
          <CardDescription>
            Select an image file (PNG, JPG, WebP) of the problem you need help with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PhotoSolverForm />
        </CardContent>
      </Card>
    </div>
  );
}
