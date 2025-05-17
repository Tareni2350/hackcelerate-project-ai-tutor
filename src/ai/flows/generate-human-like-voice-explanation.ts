'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating human-like voice explanations of concepts.
 *
 * - generateHumanLikeVoiceExplanation - A function that generates voice explanations.
 * - GenerateHumanLikeVoiceExplanationInput - The input type for the generateHumanLikeVoiceExplanation function.
 * - GenerateHumanLikeVoiceExplanationOutput - The return type for the generateHumanLikeVoiceExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHumanLikeVoiceExplanationInputSchema = z.object({
  concept: z.string().describe('The concept to explain.'),
  studentMood: z.string().optional().describe('The current mood of the student.'),
});
export type GenerateHumanLikeVoiceExplanationInput = z.infer<
  typeof GenerateHumanLikeVoiceExplanationInputSchema
>;

const GenerateHumanLikeVoiceExplanationOutputSchema = z.object({
  explanation: z.string().describe('The human-like voice explanation of the concept.'),
});
export type GenerateHumanLikeVoiceExplanationOutput = z.infer<
  typeof GenerateHumanLikeVoiceExplanationOutputSchema
>;

export async function generateHumanLikeVoiceExplanation(
  input: GenerateHumanLikeVoiceExplanationInput
): Promise<GenerateHumanLikeVoiceExplanationOutput> {
  return generateHumanLikeVoiceExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHumanLikeVoiceExplanationPrompt',
  input: {schema: GenerateHumanLikeVoiceExplanationInputSchema},
  output: {schema: GenerateHumanLikeVoiceExplanationOutputSchema},
  prompt: `You are an AI tutor who explains concepts in a natural, human-like voice. 

  The student is currently feeling: {{studentMood}}

  Explain the following concept: {{{concept}}}.',
});

const generateHumanLikeVoiceExplanationFlow = ai.defineFlow(
  {
    name: 'generateHumanLikeVoiceExplanationFlow',
    inputSchema: GenerateHumanLikeVoiceExplanationInputSchema,
    outputSchema: GenerateHumanLikeVoiceExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
