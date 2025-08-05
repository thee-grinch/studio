
'use server';
/**
 * @fileOverview A flow to generate a set of health tips for a specific week of pregnancy.
 *
 * - getHealthTips - A function that generates the tips.
 * - HealthTipsInput - The input type for the getHealthTips function.
 * - HealthTipsOutput - The return type for the getHealthTips function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const HealthTipsInputSchema = z.object({
  currentWeek: z.number().describe('The current week of pregnancy.'),
});
export type HealthTipsInput = z.infer<typeof HealthTipsInputSchema>;

const TipSchema = z.object({
    category: z.enum(["Nutrition", "Exercise", "Emotional Wellness"]),
    tip: z.string().describe("A concise, actionable health tip. 1-2 sentences.")
});

const HealthTipsOutputSchema = z.object({
  tips: z.array(TipSchema).length(3).describe("An array of exactly three health tips, one for each category: Nutrition, Exercise, and Emotional Wellness."),
});
export type HealthTipsOutput = z.infer<typeof HealthTipsOutputSchema>;

export async function getHealthTips(
  input: HealthTipsInput
): Promise<HealthTipsOutput> {
  return healthTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthTipsPrompt',
  input: { schema: HealthTipsInputSchema },
  output: { schema: HealthTipsOutputSchema },
  prompt: `You are a helpful and empathetic AI pregnancy health assistant.
Your goal is to provide three distinct, relevant health tips for a given week of pregnancy.
The user is currently in week {{currentWeek}}.

Please generate exactly one tip for each of the following categories:
1.  **Nutrition:** Focus on specific nutrients, foods, or hydration relevant to week {{currentWeek}}.
2.  **Exercise:** Suggest safe and appropriate physical activities or stretches.
3s  **Emotional Wellness:** Provide advice on managing stress, mood changes, or preparing mentally.

The tips should be concise (1-2 sentences), practical, and supportive in tone.
Ensure the output is formatted as a valid JSON object containing a 'tips' array, where each object has a 'category' and 'tip' field, adhering to the output schema.
`,
});

const healthTipsFlow = ai.defineFlow(
  {
    name: 'healthTipsFlow',
    inputSchema: HealthTipsInputSchema,
    outputSchema: HealthTipsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
