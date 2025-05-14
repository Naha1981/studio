
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
  summary: z.string().describe('A text-based summary report of the CEAI survey data, formatted with Markdown for bolding and bullet points.'),
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

Please format the output as structured text that can be easily read or further processed (e.g., into HTML from Markdown).
- For all section headings and subheadings, make them **bold** using Markdown syntax (e.g., "**Your Heading Here**"). Specifically, ensure the following headings, and any other similar section titles, are bolded using this \`**heading text**\` format:
    - "**Corporate Entrepreneurship Assessment Instrument (CEAI) Survey Analysis**"
    - "**Overall Results**"
    - "**Overall Averages (based on provided pre-calculated averages)**"
    - "**Reliability Analysis:**"
    - "**Department Breakdown:**"
    - "**Interpretation:**"
    - "**Recommendations:**"
- Use standard Markdown bullet points (e.g., "* Item 1" or "- Item 1") where appropriate for lists.
- CRITICAL: Do NOT use Markdown heading syntax like '#', '##', '###', etc. Headings should be distinguished by being bold (as described above) and through clear textual structure (e.g., on their own line, possibly followed by a blank line).
- Avoid using HTML tags directly in your output.
- Avoid code blocks unless the data itself is code.
- Ensure proper line breaks, spacing, and overall structure for easy readability.

Instructions:

1.  **Input Data**: The CSV data is: {{{csvData}}}.
2.  **Processing**: Validate the input, compute scores, perform reliability analysis, and breakdown by department if applicable.
3.  **Output**: Return a text-based summary adhering to all the formatting guidelines above. The content should be well-structured, including overall averages, reliability metrics (Cronbach’s alpha), and department breakdowns if available.
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

