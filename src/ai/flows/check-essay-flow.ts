
'use server';
/**
 * @fileOverview An AI flow to check student essays for grammatical errors, provide paraphrasing suggestions, and offer a fully rewritten version.
 *
 * - checkEssay - A function that handles the essay checking process.
 * - CheckEssayInput - The input type for the checkEssay function.
 * - CheckEssayOutput - The return type for the checkEssay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckEssayInputSchema = z.object({
  essayText: z.string().min(50, { message: "Essay text must be at least 50 characters." }).describe('The student\'s essay text to be checked.'),
});
export type CheckEssayInput = z.infer<typeof CheckEssayInputSchema>;

const GrammaticalErrorSchema = z.object({
  originalText: z.string().describe("The original text snippet with the error."),
  suggestedCorrection: z.string().describe("The suggested correction for the grammatical error."),
  explanation: z.string().describe("A brief explanation of the grammatical rule or error."),
});

const ParaphrasingSuggestionSchema = z.object({
  originalSentence: z.string().describe("The original sentence that could be paraphrased."),
  suggestedParaphrase: z.string().describe("A suggested paraphrased version of the sentence."),
  reason: z.string().describe("The reason why paraphrasing might improve this sentence (e.g., clarity, conciseness, flow, word choice)."),
});

const CheckEssayOutputSchema = z.object({
  overallFeedback: z.string().describe("Brief overall constructive feedback on the essay's writing quality based on the analysis."),
  grammaticalErrors: z.array(GrammaticalErrorSchema).describe("A list of identified grammatical errors, their corrections, and explanations."),
  paraphrasingSuggestions: z.array(ParaphrasingSuggestionSchema).describe("A list of suggestions for paraphrasing parts of the essay for improvement."),
  fullyParaphrasedEssay: z.string().optional().describe("The entire essay, rewritten with improved clarity, flow, and conciseness, incorporating paraphrasing suggestions and grammatical corrections where appropriate. If the original essay is too problematic to meaningfully paraphrase, this may be omitted or contain a note to that effect."),
});
export type CheckEssayOutput = z.infer<typeof CheckEssayOutputSchema>;

export async function checkEssay(input: CheckEssayInput): Promise<CheckEssayOutput> {
  return checkEssayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkEssayPrompt',
  input: {schema: CheckEssayInputSchema},
  output: {schema: CheckEssayOutputSchema},
  prompt: `You are an expert writing assistant specializing in reviewing student essays. Your task is to analyze the provided essay for grammatical errors, opportunities for paraphrasing, and then provide a fully rewritten version of the essay that incorporates these improvements.

Essay Text:
{{{essayText}}}

Please provide feedback in the structured JSON format as defined by the output schema.
1.  Grammatical Errors:
    *   Identify specific text snippets with grammatical errors.
    *   For each error, provide a suggested correction.
    *   Explain the grammatical rule or the nature of the error.
2.  Paraphrasing Suggestions:
    *   Identify sentences or phrases that could be improved by paraphrasing.
    *   For each, provide a suggested paraphrased version.
    *   Explain why paraphrasing would improve the sentence (e.g., enhances clarity, improves conciseness, strengthens argument, varies sentence structure, better word choice).
3.  Overall Feedback:
    *   Provide brief overall constructive feedback on the essay's writing quality based on your analysis.
4.  Fully Paraphrased Essay:
    *   Rewrite the entire essay, applying grammatical corrections and integrating paraphrasing suggestions to enhance overall clarity, flow, conciseness, and impact.
    *   This rewritten version should maintain the original intent and core arguments of the student's essay but present it in a more polished and effective manner.
    *   If the original essay is too short, nonsensical, or contains too many fundamental issues to create a meaningful full paraphrase, you may state that a full rewrite is not feasible in the 'fullyParaphrasedEssay' field or provide a very brief, high-level attempt.

Focus on common grammatical issues like subject-verb agreement, tense consistency, punctuation, article usage, and word choice.
For paraphrasing, look for sentences that are overly complex, use passive voice inappropriately, are repetitive, or could be expressed more effectively.
If no errors or suggestions are found in a category (grammatical errors, paraphrasing suggestions), return an empty array for that category.
`,
});

const checkEssayFlow = ai.defineFlow(
  {
    name: 'checkEssayFlow',
    inputSchema: CheckEssayInputSchema,
    outputSchema: CheckEssayOutputSchema,
  },
  async (input: CheckEssayInput) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('The AI was unable to generate feedback for the essay.');
    }
    return output;
  }
);
