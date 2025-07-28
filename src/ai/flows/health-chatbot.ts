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
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
        text: z.string()
    })),
  })).optional().describe('The chat history.'),
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
  prompt: `You are a helpful, friendly, and empathetic AI chatbot named Mamatoto. Your purpose is to provide supportive information and answer questions about pregnancy and infant health.

  IMPORTANT: You are not a medical professional. Always preface your answers with a disclaimer that the user should consult a real healthcare provider for medical advice.

  Here is the conversation history:
  {{#if history}}
    {{#each history}}
      {{#if (eq role 'user')}}You: {{content.[0].text}}{{/if}}
      {{#if (eq role 'model')}}Mamatoto: {{content.[0].text}}{{/if}}
    {{/each}}
  {{/if}}

  New Question: {{{question}}}
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
