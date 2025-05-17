'use server';
/**
 * @fileOverview A flow that generates personalized explanations based on relevant educational resources using RAG.
 *
 * - generateExplanationFromRag - A function that generates the explanation.
 * - GenerateExplanationFromRagInput - The input type for the generateExplanationFromRag function.
 * - GenerateExplanationFromRagOutput - The return type for the generateExplanationFromRag function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExplanationFromRagInputSchema = z.object({
  concept: z.string().describe('The concept the student wants to understand.'),
  educationalResource: z.string().describe('Relevant educational resources, such as textbook sections or lecture notes.'),
});
export type GenerateExplanationFromRagInput = z.infer<typeof GenerateExplanationFromRagInputSchema>;

const GenerateExplanationFromRagOutputSchema = z.object({
  explanation: z.string().describe('A personalized explanation of the concept based on the provided resources.'),
});
export type GenerateExplanationFromRagOutput = z.infer<typeof GenerateExplanationFromRagOutputSchema>;

export async function generateExplanationFromRag(input: GenerateExplanationFromRagInput): Promise<GenerateExplanationFromRagOutput> {
  return generateExplanationFromRagFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationFromRagPrompt',
  input: {schema: GenerateExplanationFromRagInputSchema},
  output: {schema: GenerateExplanationFromRagOutputSchema},
  prompt: `You are an AI tutor specializing in providing personalized explanations to students. A student is trying to understand the following concept:

Concept: {{{concept}}}

Use the following educational resource to provide the explanation. Tailor the explanation to the student's needs and ensure it is clear and easy to understand.

Educational Resource: {{{educationalResource}}}

Provide a detailed explanation.`,
});

const generateExplanationFromRagFlow = ai.defineFlow(
  {
    name: 'generateExplanationFromRagFlow',
    inputSchema: GenerateExplanationFromRagInputSchema,
    outputSchema: GenerateExplanationFromRagOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
