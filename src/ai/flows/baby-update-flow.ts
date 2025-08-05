
'use server';
/**
 * @fileOverview A flow to generate a personalized baby development update for the user's pregnancy week.
 *
 * - getBabyUpdate - A function that generates a personalized update.
 * - BabyUpdateInput - The input type for the getBabyUpdate function.
 * - BabyUpdateOutput - The return type for the getBabyUpdate function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BabyUpdateInputSchema = z.object({
  currentWeek: z.number().describe('The current week of pregnancy.'),
});
export type BabyUpdateInput = z.infer<typeof BabyUpdateInputSchema>;

const BabyUpdateOutputSchema = z.object({
  title: z
    .string()
    .describe('A fun, engaging title comparing the baby\'s size to a fruit or vegetable (e.g., "Your baby is the size of a lemon!").'),
  description: z
    .string()
    .describe(
      'A concise, informative paragraph about the baby\'s key developmental milestones for the week. Should be 2-3 sentences.'
    ),
  imageHint: z.string().describe('A one or two-word hint for a stock photo to accompany the update, like "lemon fruit" or "avocado fruit".')
});
export type BabyUpdateOutput = z.infer<typeof BabyUpdateOutputSchema>;

export async function getBabyUpdate(
  input: BabyUpdateInput
): Promise<BabyUpdateOutput> {
  return babyUpdateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'babyUpdatePrompt',
  input: { schema: BabyUpdateInputSchema },
  output: { schema: BabyUpdateOutputSchema },
  prompt: `You are a helpful and creative AI pregnancy assistant.
Your goal is to provide a single, fun, and informative update about the baby's development for the user's current week of pregnancy.
The user is currently in week {{currentWeek}}.

Generate an update that includes:
1.  A "size comparison" title, comparing the baby to a common fruit or vegetable.
2.  A short paragraph (2-3 sentences) describing the most interesting developmental milestones happening this week. For example, you could mention the development of senses, movement, or unique features like lanugo or fingerprints.
3.  A simple hint for finding a stock photo, which should be the fruit or vegetable from the title.

The tone should be positive, exciting, and easy to understand.

Ensure the output is formatted as valid JSON that adheres to the output schema.
`,
});

const babyUpdateFlow = ai.defineFlow(
  {
    name: 'babyUpdateFlow',
    inputSchema: BabyUpdateInputSchema,
    outputSchema: BabyUpdateOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
