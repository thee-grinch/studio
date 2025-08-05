
'use server';
/**
 * @fileOverview A flow to generate a personalized health tip for the user's dashboard.
 *
 * - getDashboardTip - A function that generates a personalized tip.
 * - DashboardTipInput - The input type for the getDashboardTip function.
 * - DashboardTipOutput - The return type for the getDashboardTip function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SymptomLogSchema = z.object({
  symptoms: z.array(z.string()).optional(),
  moods: z.array(z.string()).optional(),
  date: z.string(),
  createdAt: z.string().optional(), // Expect a string now
});

const WeightLogSchema = z.object({
    weight: z.number(),
    date: z.string(),
    createdAt: z.string().optional(), // Expect a string now
});

const DashboardTipInputSchema = z.object({
  currentWeek: z.number().describe('The current week of pregnancy.'),
  trimester: z.number().describe('The current trimester of pregnancy.'),
  recentSymptoms: z
    .array(SymptomLogSchema)
    .optional()
    .describe('An array of recent symptom and mood logs.'),
  recentWeight: z.array(WeightLogSchema).optional().describe('An array of recent weight logs.'),
});
export type DashboardTipInput = z.infer<typeof DashboardTipInputSchema>;

const DashboardTipOutputSchema = z.object({
  title: z
    .string()
    .describe('A short, engaging title for the tip or alert (e.g., "Stay Hydrated!" or "Iron Boost").'),
  description: z
    .string()
    .describe(
      'A concise, personalized piece of advice or an important observation. Should be 1-2 sentences.'
    ),
  isUrgent: z.boolean().describe('Set to true if the tip is an urgent alert (e.g., high blood pressure mentioned).'),
});
export type DashboardTipOutput = z.infer<typeof DashboardTipOutputSchema>;

export async function getDashboardTip(
  input: DashboardTipInput
): Promise<DashboardTipOutput> {
  return dashboardTipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dashboardTipPrompt',
  input: { schema: DashboardTipInputSchema },
  output: { schema: DashboardTipOutputSchema },
  prompt: `You are a helpful and empathetic AI pregnancy health assistant.
Your goal is to provide a single, highly relevant, and personalized health tip or alert for the user's dashboard.
The user is currently in week {{currentWeek}} of their pregnancy (trimester {{trimester}}).

Analyze the user's recent health data to identify the most important topic to address.
- Recent Symptoms/Moods: {{#if recentSymptoms}} {{jsonStringify recentSymptoms}} {{else}} No recent symptoms logged. {{/if}}
- Recent Weight logs (in lbs): {{#if recentWeight}} {{jsonStringify recentWeight}} {{else}} No recent weight logged. {{/if}}

Based on the data and the current week of pregnancy, generate a concise and actionable tip.
- If you see a concerning pattern (e.g., a symptom that could be serious, rapid weight change), create an "alert".
- Otherwise, provide a proactive health "tip" relevant to their current stage.
- Focus on ONE key takeaway. Do not provide a list of tips.
- The tone should be supportive and informative, not alarming unless necessary.
- Prioritize tips related to common week {{currentWeek}} symptoms or upcoming developmental milestones.
- Ensure the output is formatted as valid JSON that adheres to the output schema.
`,
});

const dashboardTipFlow = ai.defineFlow(
  {
    name: 'dashboardTipFlow',
    inputSchema: DashboardTipInputSchema,
    outputSchema: DashboardTipOutputSchema,
  },
  async (input) => {
    // Genkit's `prompt` helper doesn't have a built-in jsonStringify helper.
    // So we manually stringify the complex objects before passing them to the prompt.
    const processedInput = {
      ...input,
      recentSymptoms: JSON.stringify(input.recentSymptoms || []),
      recentWeight: JSON.stringify(input.recentWeight || []),
    }
    const { output } = await prompt(processedInput);
    return output!;
  }
);
