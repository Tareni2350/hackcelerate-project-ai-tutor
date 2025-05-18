
"use client";

import type { HistoryEntryClient } from '../page'; // Client-side type
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Brain, FileText, Camera, Lightbulb, Volume2, History as HistoryIcon } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

// This is the type expected from Firestore (server actions save this)
export interface HistoryEntryServer {
  id: string;
  type: string;
  input: any;
  output: any;
  timestamp: { seconds: number, nanoseconds: number } | null; // Firestore Timestamp structure
}


interface HistoryItemCardProps {
  item: HistoryEntryClient;
}

function getInteractionIcon(type: string) {
  switch (type) {
    case "essay_check":
      return <FileText className="h-5 w-5 text-primary" />;
    case "photo_problem":
      return <Camera className="h-5 w-5 text-primary" />;
    case "rag_explanation":
      return <Brain className="h-5 w-5 text-primary" />;
    case "voice_explanation":
      return <Volume2 className="h-5 w-5 text-primary" />;
    case "quiz_generation":
      return <Lightbulb className="h-5 w-5 text-primary" />;
    default:
      return <HistoryIcon className="h-5 w-5 text-primary" />;
  }
}

function getInteractionTitle(type: string): string {
  switch (type) {
    case "essay_check":
      return "Essay Checked";
    case "photo_problem":
      return "Photo Problem Solved";
    case "rag_explanation":
      return "RAG Explanation";
    case "voice_explanation":
      return "Voice Explanation";
    case "quiz_generation":
      return "Quiz Generated";
    default:
      return "Activity";
  }
}

function getInputSummary(item: HistoryEntryClient): string {
  switch (item.type) {
    case "essay_check":
      return `Essay: "${item.input?.essayText?.substring(0, 50)}..."`;
    case "photo_problem":
      return `Problem: ${item.input?.problemContext || "Image analysis"}`;
    case "rag_explanation":
      return `Concept: ${item.input?.concept}`;
    case "voice_explanation":
      return `Concept: ${item.input?.concept}`;
    case "quiz_generation":
      return `Topic: ${item.input?.topic}, Level: ${item.input?.learningProgress || 'N/A'}`;
    default:
      return "Details in full view.";
  }
}


export function HistoryItemCard({ item }: HistoryItemCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getInteractionIcon(item.type)}
          <CardTitle className="text-lg">{getInteractionTitle(item.type)}</CardTitle>
        </div>
        <CardDescription>
          {item.timestamp ? formatDistanceToNow(item.timestamp, { addSuffix: true }) : 'Date not available'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground truncate">{getInputSummary(item)}</p>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">View Details</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[70vw] max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Interaction Details: {getInteractionTitle(item.type)}</DialogTitle>
              <DialogDescription>
                 {item.timestamp ? item.timestamp.toLocaleString() : 'Date not available'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Input:</h4>
                <pre className="bg-muted p-3 rounded-md text-xs whitespace-pre-wrap break-all">
                  {JSON.stringify(item.input, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Output:</h4>
                <pre className="bg-muted p-3 rounded-md text-xs whitespace-pre-wrap break-all">
                  {JSON.stringify(item.output, null, 2)}
                </pre>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
