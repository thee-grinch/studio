'use server';

/**
 * @fileOverview AI Health Chatbot flow that answers questions about pregnancy and infant health.
 *
 * - healthChatbot - A function that handles the health questions.
 * - HealthChatbotInput - The input type for the healthChatbot function.
 * - HealthChatbotOutput - The return type for the healthChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HealthChatbotInputSchema = z.object({
  question: z.string().describe('The question about pregnancy or infant health.'),
});
export type HealthChatbotInput = z.infer<typeof HealthChatbotInputSchema>;

const HealthChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type HealthChatbotOutput = z.infer<typeof HealthChatbotOutputSchema>;

export async function healthChatbot(input: HealthChatbotInput): Promise<HealthChatbotOutput> {
  return healthChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthChatbotPrompt',
  input: {schema: HealthChatbotInputSchema},
  output: {schema: HealthChatbotOutputSchema},
  prompt: `You are a helpful AI chatbot that answers questions about pregnancy and infant health.

  Question: {{{question}}}
  Answer: `,
});

const healthChatbotFlow = ai.defineFlow(
  {
    name: 'healthChatbotFlow',
    inputSchema: HealthChatbotInputSchema,
    outputSchema: HealthChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
