
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
  } catch (err) {
    console.error("Error in getRagExplanationAction:", err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(String(err) || "Failed to generate RAG explanation due to an unknown error.");
  }
}

export async function getVoiceExplanationAction(input: GenerateHumanLikeVoiceExplanationInput): Promise<GenerateHumanLikeVoiceExplanationOutput> {
  try {
    const result = await generateHumanLikeVoiceExplanation(input);
    return result;
  } catch (err) {
    console.error("Error in getVoiceExplanationAction:", err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(String(err) || "Failed to generate voice explanation due to an unknown error.");
  }
}

export async function generateQuizAction(input: GenerateQuizFromTopicInput): Promise<GenerateQuizFromTopicOutput> {
  try {
    const result = await generateQuizFromTopic(input);
    return result;
  } catch (err) {
    console.error("Error in generateQuizAction:", err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(String(err) || "Failed to generate quiz due to an unknown error.");
  }
}

export async function solvePhotoProblemAction(input: SolvePhotoProblemInput): Promise<SolvePhotoProblemOutput> {
  try {
    const result = await solvePhotoProblem(input);
    return result;
  } catch (err) {
    console.error("Error in solvePhotoProblemAction:", err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(String(err) || "Failed to solve photo problem due to an unknown error.");
  }
}

export async function checkEssayAction(input: CheckEssayInput): Promise<CheckEssayOutput> {
  try {
    const result = await checkEssay(input);
    return result;
  } catch (err) {
    console.error("Error in checkEssayAction:", err);
    if (err instanceof z.ZodError) {
        throw new Error(`Essay validation failed: ${err.errors.map(e => e.message).join(', ')}`);
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error(String(err) || "Failed to check essay due to an unknown error.");
  }
}
