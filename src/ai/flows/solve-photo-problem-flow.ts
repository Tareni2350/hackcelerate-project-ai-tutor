
'use server';
/**
 * @fileOverview A Genkit flow to analyze an image of a problem and provide an explanation.
 *
 * - solvePhotoProblem - A function that handles the photo problem solving process.
 * - SolvePhotoProblemInput - The input type for the solvePhotoProblem function.
 * - SolvePhotoProblemOutput - The return type for the solvePhotoProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolvePhotoProblemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  problemContext: z.string().optional().describe('Optional context provided by the student about the problem (e.g., subject, topic).'),
});
export type SolvePhotoProblemInput = z.infer<typeof SolvePhotoProblemInputSchema>;

const SolvePhotoProblemOutputSchema = z.object({
  explanation: z.string().describe("A step-by-step explanation of how to solve the problem shown in the image."),
  identifiedProblemType: z.string().optional().describe("The type of problem identified by the AI (e.g., 'Algebra Equation', 'Physics Kinematics Problem')."),
});
export type SolvePhotoProblemOutput = z.infer<typeof SolvePhotoProblemOutputSchema>;

export async function solvePhotoProblem(input: SolvePhotoProblemInput): Promise<SolvePhotoProblemOutput> {
  return solvePhotoProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solvePhotoProblemPrompt',
  input: {schema: SolvePhotoProblemInputSchema},
  output: {schema: SolvePhotoProblemOutputSchema},
  prompt: `You are an expert AI Tutor. A student has uploaded an image of a problem they are stuck on.
Your task is to analyze the image and any provided context, then provide a clear, detailed, step-by-step explanation to help the student understand how to solve the problem.

If possible, identify the type or category of the problem (e.g., "Linear Algebra", "Calculus Differentiation", "Chemical Equation Balancing").

Student's Problem Image:
{{media url=photoDataUri}}

{{#if problemContext}}
Additional Context from Student:
{{{problemContext}}}
{{/if}}

Begin your explanation by restating or clearly identifying the problem from the image.
Then, break down the solution into logical steps. Explain the reasoning behind each step.
Conclude with the final answer if applicable, or a summary of the solution method.
Ensure your explanation is easy to follow and educational.
`,
});

const solvePhotoProblemFlow = ai.defineFlow(
  {
    name: 'solvePhotoProblemFlow',
    inputSchema: SolvePhotoProblemInputSchema,
    outputSchema: SolvePhotoProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI was unable to generate an explanation for the provided image.');
    }
    return output;
  }
);
