'use server';
/**
 * @fileOverview Generates a weekly summary of team activities, highlighting key accomplishments and potential roadblocks.
 *
 * - generateTeamActivitySummary - A function that generates the team activity summary.
 * - GenerateTeamActivitySummaryInput - The input type for the generateTeamActivitySummary function.
 * - GenerateTeamActivitySummaryOutput - The return type for the generateTeamActivitySummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTeamActivitySummaryInputSchema = z.object({
  teamName: z.string().describe('The name of the team.'),
  startDate: z.string().describe('The start date for the summary period (YYYY-MM-DD).'),
  endDate: z.string().describe('The end date for the summary period (YYYY-MM-DD).'),
  activities: z.array(z.string()).describe('List of activities performed by the team during the period.'),
  accomplishments: z.array(z.string()).describe('List of key accomplishments by the team.'),
  roadblocks: z.array(z.string()).describe('List of potential roadblocks the team faced.'),
});
export type GenerateTeamActivitySummaryInput = z.infer<typeof GenerateTeamActivitySummaryInputSchema>;

const GenerateTeamActivitySummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the team activities, accomplishments, and roadblocks.'),
});
export type GenerateTeamActivitySummaryOutput = z.infer<typeof GenerateTeamActivitySummaryOutputSchema>;

export async function generateTeamActivitySummary(input: GenerateTeamActivitySummaryInput): Promise<GenerateTeamActivitySummaryOutput> {
  return generateTeamActivitySummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTeamActivitySummaryPrompt',
  input: {schema: GenerateTeamActivitySummaryInputSchema},
  output: {schema: GenerateTeamActivitySummaryOutputSchema},
  prompt: `You are a team activity summarization expert. Your job is to take in the activities of the team, accomplishments, and roadblocks and create a concise weekly summary for the team manager.

  Team Name: {{{teamName}}}
  Start Date: {{{startDate}}}
  End Date: {{{endDate}}}

  Activities:
  {{#each activities}}
  - {{{this}}}
  {{/each}}

  Accomplishments:
  {{#each accomplishments}}
  - {{{this}}}
  {{/each}}

  Roadblocks:
  {{#each roadblocks}}
  - {{{this}}}
  {{/each}}

  Summary:`,
});

const generateTeamActivitySummaryFlow = ai.defineFlow(
  {
    name: 'generateTeamActivitySummaryFlow',
    inputSchema: GenerateTeamActivitySummaryInputSchema,
    outputSchema: GenerateTeamActivitySummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
