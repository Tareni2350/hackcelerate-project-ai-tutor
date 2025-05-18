
// src/lib/actions.ts
"use server";

import { z } from "zod";
import { generateExplanationFromRag, type GenerateExplanationFromRagInput, type GenerateExplanationFromRagOutput } from "@/ai/flows/generate-explanation-from-rag";
import { generateHumanLikeVoiceExplanation, type GenerateHumanLikeVoiceExplanationInput, type GenerateHumanLikeVoiceExplanationOutput } from "@/ai/flows/generate-human-like-voice-explanation";
import { generateQuizFromTopic, type GenerateQuizFromTopicInput, type GenerateQuizFromTopicOutput } from "@/ai/flows/generate-quiz-from-topic";
import { solvePhotoProblem, type SolvePhotoProblemInput, type SolvePhotoProblemOutput } from "@/ai/flows/solve-photo-problem-flow";
import { checkEssay, type CheckEssayInput, type CheckEssayOutput } from "@/ai/flows/check-essay-flow";

// Import Firestore essentials
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
    const historyEntry = {
      type,
      input,
      output,
      timestamp: serverTimestamp(),
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
  } catch (err) {
    console.error("Error in getRagExplanationAction:", err); // Log the original error
    if (err instanceof Error) {
      throw err; // Re-throw the original Error object
    }
    // If it's not an Error object, wrap it
    throw new Error(String(err) || "Failed to generate RAG explanation due to an unknown error.");
  }
}

export async function getVoiceExplanationAction(input: GenerateHumanLikeVoiceExplanationInput): Promise<GenerateHumanLikeVoiceExplanationOutput> {
  try {
    const result = await generateHumanLikeVoiceExplanation(input);
    await saveToHistory("voice_explanation", input, result);
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
    await saveToHistory("quiz_generation", input, result);
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
    const historyInput = { ...input, photoDataUri: input.photoDataUri ? 'Image provided (not stored in history log)' : undefined };
    await saveToHistory("photo_problem", historyInput, result);
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
    await saveToHistory("essay_check", input, result);
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
