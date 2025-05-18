// src/lib/actions.ts
"use server";

import { z } from "zod";
import { generateExplanationFromRag, type GenerateExplanationFromRagInput, type GenerateExplanationFromRagOutput } from "@/ai/flows/generate-explanation-from-rag";
import { generateHumanLikeVoiceExplanation, type GenerateHumanLikeVoiceExplanationInput, type GenerateHumanLikeVoiceExplanationOutput } from "@/ai/flows/generate-human-like-voice-explanation";
import { generateQuizFromTopic, type GenerateQuizFromTopicInput, type GenerateQuizFromTopicOutput } from "@/ai/flows/generate-quiz-from-topic";
import { solvePhotoProblem, type SolvePhotoProblemInput, type SolvePhotoProblemOutput } from "@/ai/flows/solve-photo-problem-flow";
import { checkEssay, type CheckEssayInput, type CheckEssayOutput } from "@/ai/flows/check-essay-flow";
import { generateFlashcards, type GenerateFlashcardsInput, type GenerateFlashcardsOutput } from "@/ai/flows/generate-flashcards-flow";


export async function getRagExplanationAction(input: GenerateExplanationFromRagInput): Promise<GenerateExplanationFromRagOutput> {
  try {
    const result = await generateExplanationFromRag(input);
    return result;
  } catch (err) {
    console.error("Error in getRagExplanationAction:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to generate RAG explanation. Details: ${errorMessage}`);
  }
}

export async function getVoiceExplanationAction(input: GenerateHumanLikeVoiceExplanationInput): Promise<GenerateHumanLikeVoiceExplanationOutput> {
  try {
    const result = await generateHumanLikeVoiceExplanation(input);
    return result;
  } catch (err) {
    console.error("Error in getVoiceExplanationAction:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to generate voice explanation. Details: ${errorMessage}`);
  }
}

export async function generateQuizAction(input: GenerateQuizFromTopicInput): Promise<GenerateQuizFromTopicOutput> {
  try {
    const result = await generateQuizFromTopic(input);
    return result;
  } catch (err) {
    console.error("Error in generateQuizAction:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to generate quiz. Details: ${errorMessage}`);
  }
}

export async function solvePhotoProblemAction(input: SolvePhotoProblemInput): Promise<SolvePhotoProblemOutput> {
  try {
    const result = await solvePhotoProblem(input);
    return result;
  } catch (err) {
    console.error("Error in solvePhotoProblemAction:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to solve photo problem. Details: ${errorMessage}`);
  }
}

export async function checkEssayAction(input: CheckEssayInput): Promise<CheckEssayOutput> {
  try {
    const result = await checkEssay(input);
    return result;
  } catch (err) {
    console.error("Error in checkEssayAction:", err);
    if (err instanceof z.ZodError) {
      const validationErrors = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      throw new Error(`Input validation failed: ${validationErrors}`);
    }
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to check essay. Details: ${errorMessage}`);
  }
}

export async function generateFlashcardsAction(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  try {
    const result = await generateFlashcards(input);
    return result;
  } catch (err) {
    console.error("Error in generateFlashcardsAction:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to generate flashcards. Details: ${errorMessage}`);
  }
}
