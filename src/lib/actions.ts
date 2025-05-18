
// src/lib/actions.ts
"use server";

import { z } from "zod";
import { generateExplanationFromRag, type GenerateExplanationFromRagInput, type GenerateExplanationFromRagOutput } from "@/ai/flows/generate-explanation-from-rag";
import { generateHumanLikeVoiceExplanation, type GenerateHumanLikeVoiceExplanationInput, type GenerateHumanLikeVoiceExplanationOutput } from "@/ai/flows/generate-human-like-voice-explanation";
import { generateQuizFromTopic, type GenerateQuizFromTopicInput, type GenerateQuizFromTopicOutput } from "@/ai/flows/generate-quiz-from-topic";
import { solvePhotoProblem, type SolvePhotoProblemInput, type SolvePhotoProblemOutput } from "@/ai/flows/solve-photo-problem-flow";
import { checkEssay, type CheckEssayInput, type CheckEssayOutput } from "@/ai/flows/check-essay-flow";


export async function getRagExplanationAction(input: GenerateExplanationFromRagInput): Promise<GenerateExplanationFromRagOutput> {
  try {
    const result = await generateExplanationFromRag(input);
    return result;
  } catch (error) {
    console.error("Error in getRagExplanationAction:", error);
    throw new Error("Failed to generate RAG explanation.");
  }
}

export async function getVoiceExplanationAction(input: GenerateHumanLikeVoiceExplanationInput): Promise<GenerateHumanLikeVoiceExplanationOutput> {
  try {
    const result = await generateHumanLikeVoiceExplanation(input);
    return result;
  } catch (error) {
    console.error("Error in getVoiceExplanationAction:", error);
    throw new Error("Failed to generate voice explanation.");
  }
}

export async function generateQuizAction(input: GenerateQuizFromTopicInput): Promise<GenerateQuizFromTopicOutput> {
  try {
    const result = await generateQuizFromTopic(input);
    return result;
  } catch (error) {
    console.error("Error in generateQuizAction:", error);
    throw new Error("Failed to generate quiz.");
  }
}

export async function solvePhotoProblemAction(input: SolvePhotoProblemInput): Promise<SolvePhotoProblemOutput> {
  try {
    const result = await solvePhotoProblem(input);
    return result;
  } catch (error) {
    console.error("Error in solvePhotoProblemAction:", error);
    throw new Error("Failed to solve photo problem.");
  }
}

export async function checkEssayAction(input: CheckEssayInput): Promise<CheckEssayOutput> {
  try {
    // Input validation is handled by the Zod schema in the flow itself
    // and react-hook-form on the client.
    // If specific server-side validation not covered by the flow's input schema is needed,
    // it can be added here.
    const result = await checkEssay(input);
    return result;
  } catch (error) {
    console.error("Error in checkEssayAction:", error);
    // Handle Zod errors specifically if they reach here (e.g. if flow doesn't catch them)
    if (error instanceof z.ZodError) {
        throw new Error(`Essay validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while checking the essay.";
    throw new Error(`Failed to check essay: ${errorMessage}`);
  }
}
