
// src/lib/actions.ts
"use server";

import { z } from "zod"; // Added import for Zod
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
  } catch (error) { // Ensured this catch block is complete
    console.error("Error in solvePhotoProblemAction:", error);
    throw new Error("Failed to solve photo problem.");
  }
}

export async function checkEssayAction(input: CheckEssayInput): Promise<CheckEssayOutput> {
  try {
    const result = await checkEssay(input);
    return result;
  } catch (error) {
    console.error("Error in checkEssayAction:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while checking the essay.";
    if (error instanceof z.ZodError) {
        throw new Error(`Essay validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw new Error(`Failed to check essay: ${errorMessage}`);
  }
}

