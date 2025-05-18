
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

const difficultyLevels = ["Basic", "Intermediate", "Advanced"] as const;

const GenerateFlashcardsInputSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }).max(150, {message: "Topic cannot exceed 150 characters."}),
  numFlashcards: z.number().min(1, {message: "Must generate at least 1 flashcard."}).max(15, {message: "Cannot generate more than 15 flashcards."}).optional().default(5).describe('The number of flashcards to generate.'),
  difficultyLevel: z.enum(difficultyLevels).optional().describe('The difficulty level of the flashcards (e.g., Basic, Intermediate, Advanced).'),
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
{{#if difficultyLevel}}
The flashcards should be tailored for a student with a {{{difficultyLevel}}} understanding of the topic.
For "Basic" level, focus on fundamental definitions, core ideas, and simple examples.
For "Intermediate" level, include more detailed explanations, comparisons, or slightly more complex examples.
For "Advanced" level, explore nuanced concepts, applications, critical thinking questions, or connections to other topics.
{{else}}
The flashcards should be of general difficulty.
{{/if}}
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
