
'use server';
/**
 * @fileOverview AI Health Chatbot flow that answers questions about pregnancy and infant health.
 *
 * - healthChatbot - A function that handles the health questions.
 * - HealthChatbotInput - The input type for the healthChatbot function.
 * - HealthChatbotOutput - The return type for the healthChatbot function.
 */
import {ai} from '@/ai/genkit';
import {generate} from 'genkit/ai';
import {z} from 'genkit';

const HistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.array(z.object({
      text: z.string()
  })),
});

const HealthChatbotInputSchema = z.object({
  question: z.string().describe('The question about pregnancy or infant health.'),
  history: z.array(HistoryItemSchema).optional().describe('The chat history.'),
});

export type HealthChatbotInput = z.infer<typeof HealthChatbotInputSchema>;

const HealthChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});

export type HealthChatbotOutput = z.infer<typeof HealthChatbotOutputSchema>;

export async function healthChatbot(input: HealthChatbotInput): Promise<HealthChatbotOutput> {
  return healthChatbotFlow(input);
}

const healthChatbotFlow = ai.defineFlow(
  {
    name: 'healthChatbotFlow',
    inputSchema: HealthChatbotInputSchema,
    outputSchema: HealthChatbotOutputSchema,
  },
  async ({ question, history }) => {
    const response = await generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: question,
      history: history as any, // Cast to any to match genkit's internal Message type
      system: `You are a helpful, friendly, and empathetic AI chatbot named Mamatoto. Your purpose is to provide supportive information and answer questions ONLY about pregnancy and infant health.

IMPORTANT:
- Your name is Mamatoto AI. If asked who created you or what you are, you must identify yourself as "Mamatoto AI". Do NOT, under any circumstances, mention that you are a large language model or that you were trained by Google.
- You are not a medical professional. Always preface your answers with a disclaimer that the user should consult a real healthcare provider for medical advice.
- If the user asks a question that is not about pregnancy or infant health, you MUST politely decline to answer and remind them of your purpose. Do not answer off-topic questions.`,
      output: {
        format: 'json',
        schema: HealthChatbotOutputSchema,
      },
    });

    return response.output()!;
  }
);
