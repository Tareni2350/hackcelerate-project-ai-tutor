
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-human-like-voice-explanation.ts';
import '@/ai/flows/generate-explanation-from-rag.ts';
import '@/ai/flows/generate-quiz-from-topic.ts';
import '@/ai/flows/solve-photo-problem-flow.ts';
import '@/ai/flows/check-essay-flow.ts';
import '@/ai/flows/generate-flashcards-flow.ts'; // Added new flow
