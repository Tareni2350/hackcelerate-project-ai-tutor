
// src/lib/actions.ts
"use server";

import { z } from "zod";
import { generateExplanationFromRag, type GenerateExplanationFromRagInput, type GenerateExplanationFromRagOutput } from "@/ai/flows/generate-explanation-from-rag";
import { generateHumanLikeVoiceExplanation, type GenerateHumanLikeVoiceExplanationInput, type GenerateHumanLikeVoiceExplanationOutput } from "@/ai/flows/generate-human-like-voice-explanation";
import { generateQuizFromTopic, type GenerateQuizFromTopicInput, type GenerateQuizFromTopicOutput } from "@/ai/flows/generate-quiz-from-topic";
import { solvePhotoProblem, type SolvePhotoProblemInput, type SolvePhotoProblemOutput } from "@/ai/flows/solve-photo-problem-flow";
import { checkEssay, type CheckEssayInput, type CheckEssayOutput } from "@/ai/flows/check-essay-flow";

// Import Firestore essentials if using client SDK in server actions.
// For production, prefer Firebase Admin SDK for server-side operations.
// This example uses client SDK for simplicity, assuming environment compatibility.
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// db instance might need to be initialized differently for server actions if not using Admin SDK.
// Re-importing db here for server actions. This could be tricky.
// A dedicated Admin SDK setup is cleaner for server actions.
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let appServer;
if (!getApps().length) {
  appServer = initializeApp(firebaseConfig);
} else {
  appServer = getApp();
}
const dbServer = getFirestore(appServer);


async function saveToHistory(type: string, input: any, output: any) {
  try {
    // TODO: Add userId if authentication is implemented
    const historyEntry = {
      type,
      input,
      output,
      timestamp: serverTimestamp(),
      // userId: "anonymous" // Placeholder or get from authenticated session
    };
    await addDoc(collection(dbServer, "history"), historyEntry);
    console.log("History saved for type:", type);
  } catch (error) {
    console.error("Error saving to history:", error);
    // Do not re-throw, as history saving failure should not break the main action
  }
}

export async function getRagExplanationAction(input: GenerateExplanationFromRagInput): Promise<GenerateExplanationFromRagOutput> {
  try {
    const result = await generateExplanationFromRag(input);
    await saveToHistory("rag_explanation", input, result);
    return result;
  } catch (error) {
    console.error("Error in getRagExplanationAction:", error);
    throw new Error("Failed to generate RAG explanation.");
  }
}

export async function getVoiceExplanationAction(input: GenerateHumanLikeVoiceExplanationInput): Promise<GenerateHumanLikeVoiceExplanationOutput> {
  try {
    const result = await generateHumanLikeVoiceExplanation(input);
    await saveToHistory("voice_explanation", input, result);
    return result;
  } catch (error) {
    console.error("Error in getVoiceExplanationAction:", error);
    throw new Error("Failed to generate voice explanation.");
  }
}

export async function generateQuizAction(input: GenerateQuizFromTopicInput): Promise<GenerateQuizFromTopicOutput> {
  try {
    const result = await generateQuizFromTopic(input);
    await saveToHistory("quiz_generation", input, result);
    return result;
  } catch (error) {
    console.error("Error in generateQuizAction:", error);
    throw new Error("Failed to generate quiz.");
  }
}

export async function solvePhotoProblemAction(input: SolvePhotoProblemInput): Promise<SolvePhotoProblemOutput> {
  try {
    const result = await solvePhotoProblem(input);
    // For photo data URI, store a placeholder or metadata instead of the full URI in history if it's too large
    const historyInput = { ...input, photoDataUri: input.photoDataUri ? 'Image provided (not stored in history log)' : undefined };
    await saveToHistory("photo_problem", historyInput, result);
    return result;
  } catch (error) {
    console.error("Error in solvePhotoProblemAction:", error);
    throw new Error("Failed to solve photo problem.");
  }
}

export async function checkEssayAction(input: CheckEssayInput): Promise<CheckEssayOutput> {
  try {
    const result = await checkEssay(input);
    await saveToHistory("essay_check", input, result);
    return result;
  } catch (error) {
    console.error("Error in checkEssayAction:", error);
    if (error instanceof z.ZodError) {
        throw new Error(`Essay validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while checking the essay.";
    throw new Error(`Failed to check essay: ${errorMessage}`);
  }
}
