
'use server';
/**
 * @fileOverview An AI flow to generate flashcards for a given topic.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).max(150, {message: "Topic cannot exceed 150 characters."}),
  numFlashcards: z.number().min(1, {message: "Must generate at least 1 flashcard."}).max(15, {message: "Cannot generate more than 15 flashcards."}).optional().default(5).describe('The number of flashcards to generate.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const FlashcardSchema = z.object({
  front: z.string().describe("The front side of the flashcard (e.g., a term, question, or key concept)."),
  back: z.string().describe("The back side of the flashcard (e.g., a definition, answer, or explanation)."),
});

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe("A list of generated flashcards."),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert educational content creator specializing in generating effective flashcards.
For the given topic, create {{numFlashcards}} distinct flashcards.
Each flashcard should have a 'front' (a term, question, or key concept) and a 'back' (a concise definition, answer, or explanation related to the front).
Ensure the content is accurate and helpful for learning.

Topic: {{{topic}}}

Provide the output in the specified JSON format.
`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async (input: GenerateFlashcardsInput) => {
    const {output} = await prompt(input);
    if (!output || !output.flashcards) {
      console.error("generateFlashcardsFlow: AI prompt did not return valid flashcards.", {input, output});
      throw new Error("The AI was unable to generate flashcards for the given topic. The prompt might have failed or returned an unexpected response.");
    }
    return output;
  }
);
