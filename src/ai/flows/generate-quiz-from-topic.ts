// src/ai/flows/generate-quiz-from-topic.ts
'use server';

/**
 * @fileOverview Generates a quiz on a specific topic tailored to the user's learning progress.
 *
 * - generateQuizFromTopic - A function that generates a quiz from a topic.
 * - GenerateQuizFromTopicInput - The input type for the generateQuizFromTopic function.
 * - GenerateQuizFromTopicOutput - The return type for the generateQuizFromTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromTopicInputSchema = z.object({
  topic: z.string().describe('The topic to generate a quiz for.'),
  learningProgress: z.string().optional().describe('The learning progress of the student. This can be used to tailor the difficulty of the quiz.  For example, "beginner", "intermediate", or "advanced".'),
  numQuestions: z.number().optional().default(5).describe('The number of questions to generate for the quiz.'),
});
export type GenerateQuizFromTopicInput = z.infer<typeof GenerateQuizFromTopicInputSchema>;

const GenerateQuizFromTopicOutputSchema = z.object({
  quizQuestions: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers for the question.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions.'),
});
export type GenerateQuizFromTopicOutput = z.infer<typeof GenerateQuizFromTopicOutputSchema>;

export async function generateQuizFromTopic(input: GenerateQuizFromTopicInput): Promise<GenerateQuizFromTopicOutput> {
  return generateQuizFromTopicFlow(input);
}

const generateQuizFromTopicPrompt = ai.definePrompt({
  name: 'generateQuizFromTopicPrompt',
  input: {schema: GenerateQuizFromTopicInputSchema},
  output: {schema: GenerateQuizFromTopicOutputSchema},
  prompt: `You are an expert quiz generator. Generate a quiz with {{numQuestions}} questions on the topic of {{topic}}. The quiz should be tailored to the student's learning progress, which is {{learningProgress}}.  The quiz should have multiple choice questions, where each question has a question, a list of possible answers, and the correct answer.

Output the quiz in JSON format. The JSON should be an array of objects, where each object has the following fields:
- question: the quiz question
- options: a list of possible answers
- correctAnswer: the correct answer to the question

For example:
[
  {
    "question": "What is the capital of France?",
    "options": ["Paris", "London", "Berlin", "Rome"],
    "correctAnswer": "Paris"
  },
  {
    "question": "What is the highest mountain in the world?",
    "options": ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
    "correctAnswer": "Mount Everest"
  }
]

Here is the quiz:
`,
});

const generateQuizFromTopicFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTopicFlow',
    inputSchema: GenerateQuizFromTopicInputSchema,
    outputSchema: GenerateQuizFromTopicOutputSchema,
  },
  async input => {
    const {output} = await generateQuizFromTopicPrompt(input);
    return output!;
  }
);
