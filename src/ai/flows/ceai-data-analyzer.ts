
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

Please format the output in a clean and professional style adhering to the following specific guidelines:

1.  **Headings and Subheadings**:
    *   ALL headings and subheadings MUST be **bold**. Use Markdown's double asterisk syntax for bolding (e.g., "**Your Heading Here**").
    *   Specifically, ensure the following headings (and any other similar section titles you generate) are bolded:
        *   "**Corporate Entrepreneurship Assessment Instrument (CEAI) Survey Analysis**"
        *   "**Overall Results**"
        *   "**Overall Averages (based on provided pre-calculated averages)**"
        *   "**Reliability Analysis:**" (note the colon is part of the heading if you include it)
        *   "**Department Breakdown:**" (note the colon is part of the heading if you include it)
        *   "**Interpretation:**" (note the colon is part of the heading if you include it)
        *   "**Recommendations:**" (note the colon is part of the heading if you include it)
    *   CRITICAL: Do NOT use Markdown heading syntax like '#', '##', '###', etc. for headings. Only use bolding as described.

2.  **Department Breakdown Formatting**:
    *   For the "**Department Breakdown:**" section, you MUST follow this exact pattern for each department:
        **Department Name**
        Management Support Average: [Score]
        Autonomy Average: [Score]
        Rewards Average: [Score]
        Time Availability Average: [Score]
        Organizational Boundaries Average: [Score]
    *   Ensure each department's details start with the **bolded Department Name** on its own line, followed by each dimension's average on a new line, exactly as shown. Do not use bullet points for this section.

3.  **Bullet Points**:
    *   Use standard Markdown bullet points (e.g., "* Item 1" or "- Item 1") ONLY where appropriate for lists (e.g., under "**Recommendations:**" or "**Interpretation:**" if listing out points). Do NOT use them for the "Department Breakdown" section.

4.  **General Style**:
    *   Avoid using HTML tags directly in your output.
    *   Avoid code blocks (e.g., \`\`\`text ... \`\`\`) unless the data itself is code.
    *   Ensure proper line breaks, consistent spacing, and overall structure for easy readability. The output should be clean and professional.

Instructions:

1.  **Input Data**: The CSV data is: {{{csvData}}}.
2.  **Processing**: Validate the input, compute scores, perform reliability analysis, and breakdown by department if applicable, following all formatting rules for the output.
3.  **Output**: Return a single text-based summary string adhering to ALL the formatting guidelines above. The content should be well-structured, including overall averages, reliability metrics (Cronbach’s alpha), department breakdowns (formatted as specified), interpretations, and recommendations.
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

