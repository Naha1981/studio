'use server';

/**
 * @fileOverview Analyzes CEAI survey data to provide insights.
 *
 * - analyzeCEAISurveyData - A function that handles the analysis of CEAI survey data.
 * - AnalyzeCEAISurveyDataInput - The input type for the analyzeCEAISurveyData function.
 * - AnalyzeCEAISurveyDataOutput - The return type for the analyzeCEAISurveyData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCEAISurveyDataInputSchema = z.object({
  csvData: z
    .string()
    .describe('The CSV data of the CEAI survey responses.'),
});
export type AnalyzeCEAISurveyDataInput = z.infer<typeof AnalyzeCEAISurveyDataInputSchema>;

const AnalyzeCEAISurveyDataOutputSchema = z.object({
  summary: z.string().describe('A text-based summary report of the CEAI survey data.'),
});
export type AnalyzeCEAISurveyDataOutput = z.infer<typeof AnalyzeCEAISurveyDataOutputSchema>;

export async function analyzeCEAISurveyData(input: AnalyzeCEAISurveyDataInput): Promise<AnalyzeCEAISurveyDataOutput> {
  return analyzeCEAISurveyDataFlow(input);
}

const analyzeCEAISurveyDataPrompt = ai.definePrompt({
  name: 'analyzeCEAISurveyDataPrompt',
  input: {schema: AnalyzeCEAISurveyDataInputSchema},
  output: {schema: AnalyzeCEAISurveyDataOutputSchema},
  prompt: `You are an advanced data analysis assistant designed to analyze Corporate Entrepreneurship Assessment Instrument (CEAI) survey data.

You will receive a CSV file containing CEAI survey responses. Your task is to process this data, compute custom scores for five dimensions, perform reliability analysis, and generate a structured text-based summary.

Please format the output in a clean and professional style. Use bold text for section headings and subheadings instead of Markdown symbols like '#', '##', or '*'. Avoid code blocks or bullet points unless necessary. Structure the report with proper line breaks and spacing for readability.

Instructions:

1.  **Input Data**: The CSV data is: {{{csvData}}}.
2.  **Processing**: Validate the input, compute scores, perform reliability analysis, and breakdown by department if applicable.
3.  **Output**: Return a text-based summary with clear bold headings, sub-headings, and well-structured content, including overall averages, reliability metrics (Cronbach’s alpha), and department breakdowns if available.

Ensure the output is well-formatted and easy to understand.
`,
});

const analyzeCEAISurveyDataFlow = ai.defineFlow(
  {
    name: 'analyzeCEAISurveyDataFlow',
    inputSchema: AnalyzeCEAISurveyDataInputSchema,
    outputSchema: AnalyzeCEAISurveyDataOutputSchema,
  },
  async input => {
    const {output} = await analyzeCEAISurveyDataPrompt(input);
    return output!;
  }
);
