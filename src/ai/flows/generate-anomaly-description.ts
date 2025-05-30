'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a summarized description of unusual activity patterns.
 *
 * - generateAnomalyDescription - A function that generates a summarized description of unusual activity patterns.
 * - GenerateAnomalyDescriptionInput - The input type for the generateAnomalyDescription function.
 * - GenerateAnomalyDescriptionOutput - The return type for the generateAnomalyDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnomalyDescriptionInputSchema = z.object({
  activitySummary: z
    .string()
    .describe('A summary of user activity, including timestamps, actions performed, and resources accessed.'),
  teamBehaviorNorms: z
    .string()
    .describe('Description of the normal or expected behavior patterns for the team.'),
});
export type GenerateAnomalyDescriptionInput = z.infer<typeof GenerateAnomalyDescriptionInputSchema>;

const GenerateAnomalyDescriptionOutputSchema = z.object({
  anomalyDescription: z
    .string()
    .describe('A concise summary of the unusual activity patterns detected, highlighting potential issues.'),
});
export type GenerateAnomalyDescriptionOutput = z.infer<typeof GenerateAnomalyDescriptionOutputSchema>;

export async function generateAnomalyDescription(
  input: GenerateAnomalyDescriptionInput
): Promise<GenerateAnomalyDescriptionOutput> {
  return generateAnomalyDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnomalyDescriptionPrompt',
  input: {schema: GenerateAnomalyDescriptionInputSchema},
  output: {schema: GenerateAnomalyDescriptionOutputSchema},
  prompt: `You are an AI assistant designed to help team managers quickly understand potential issues by summarizing unusual activity patterns.

You are provided with a summary of user activity and a description of the normal behavior patterns for the team.

Based on this information, generate a concise summary of the unusual activity patterns detected, highlighting potential issues that the manager should be aware of.

Activity Summary: {{{activitySummary}}}
Team Behavior Norms: {{{teamBehaviorNorms}}}

Anomaly Description:`,
});

const generateAnomalyDescriptionFlow = ai.defineFlow(
  {
    name: 'generateAnomalyDescriptionFlow',
    inputSchema: GenerateAnomalyDescriptionInputSchema,
    outputSchema: GenerateAnomalyDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
