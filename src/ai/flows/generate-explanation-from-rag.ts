
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
  explanation: z.string().describe('A personalized explanation of the concept based on the provided resources, formatted in Markdown.'),
});
export type GenerateExplanationFromRagOutput = z.infer<typeof GenerateExplanationFromRagOutputSchema>;

export async function generateExplanationFromRag(input: GenerateExplanationFromRagInput): Promise<GenerateExplanationFromRagOutput> {
  return generateExplanationFromRagFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExplanationFromRagPrompt',
  input: {schema: GenerateExplanationFromRagInputSchema},
  output: {schema: GenerateExplanationFromRagOutputSchema},
  prompt: `You are an AI tutor specializing in providing personalized explanations to students, mimicking the clear and structured style of a textbook.
A student is trying to understand the following concept:

Concept: {{{concept}}}

Using the provided educational resource, craft a detailed explanation.
Format your explanation using Markdown. This includes:
- Using headings (e.g., "# Main Topic", "## Sub-topic") for structure.
- Using paragraphs for explanatory text.
- Using bullet points (e.g., "* item" or "- item") or numbered lists (e.g., "1. item") for key points or steps.
- Using **bold** or _italics_ for emphasis on key terms or concepts.

Educational Resource:
{{{educationalResource}}}

Ensure the explanation is tailored to the student's needs, clear, and easy to understand, presented as if it were a section in a well-written textbook.
Provide only the Markdown content for the explanation.`,
});

const generateExplanationFromRagFlow = ai.defineFlow(
  {
    name: 'generateExplanationFromRagFlow',
    inputSchema: GenerateExplanationFromRagInputSchema,
    outputSchema: GenerateExplanationFromRagOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.explanation) {
      console.error("generateExplanationFromRagFlow: AI prompt did not return a valid output for the given input.", {input});
      throw new Error("The AI was unable to generate an explanation. The prompt might have failed or returned an empty response.");
    }
    return output;
  }
);

