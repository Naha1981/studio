
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
  summary: z.string().describe('A plain text summary report of the CEAI survey data. Headings should be in ALL UPPERCASE. No Markdown formatting symbols (like #, *, **) should be used for headings or emphasis. Bullet points should be textual (e.g., "* Item").'),
});
export type AnalyzeCEAISurveyDataOutput = z.infer<typeof AnalyzeCEAISurveyDataOutputSchema>;

export async function analyzeCEAISurveyData(input: AnalyzeCEAISurveyDataInput): Promise<AnalyzeCEAISurveyDataOutput> {
  return analyzeCEAISurveyDataFlow(input);
}

const analyzeCEAISurveyDataPrompt = ai.definePrompt({
  name: 'analyzeCEAISurveyDataPrompt',
  input: {schema: AnalyzeCEAISurveyDataInputSchema},
  output: {schema: AnalyzeCEAISurveyDataOutputSchema},
  prompt: `You are an advanced data analysis assistant. Your task is to analyze Corporate Entrepreneurship Assessment Instrument (CEAI) survey data from a CSV file and generate a plain text summary report formatted for business users.

CRITICAL FORMATTING RULES:
1.  **PLAIN TEXT ONLY**: The entire output MUST be plain text. Do NOT use any Markdown syntax for emphasis or headings (e.g., no '#', '##', '###', '**text**', '*text*'). Do NOT use HTML tags.
2.  **HEADINGS & SUBHEADINGS**: All headings and subheadings MUST be in ALL UPPERCASE to make them stand out visually.
    *   For example:
        *   CORPORATE ENTREPRENEURSHIP ASSESSMENT INSTRUMENT (CEAI) SURVEY ANALYSIS
        *   OVERALL RESULTS
        *   OVERALL AVERAGES (BASED ON PROVIDED PRE-CALCULATED AVERAGES)
        *   RELIABILITY ANALYSIS:
        *   DEPARTMENT BREAKDOWN:
        *   INTERPRETATION:
        *   RECOMMENDATIONS:
3.  **DEPARTMENT BREAKDOWN FORMAT**: This section is critical. For each department, you MUST follow this exact pattern:
    DEPARTMENT NAME (IN ALL UPPERCASE)
    * Management Support Average: [Score]
    * Autonomy Average: [Score]
    * Rewards Average: [Score]
    * Time Availability Average: [Score]
    * Organizational Boundaries Average: [Score]
    *   There should be a blank line between department entries if there are multiple departments.
    *   Ensure each dimension score under a department is prefixed with a textual bullet point (e.g., '* ').
4.  **BULLET POINTS**: Use textual bullet points (e.g., "* Item 1" or "- Item 1") for ANY list of values or scores. This includes dimension scores within the department breakdown (as specified above) and for points under sections like INTERPRETATION or RECOMMENDATIONS.
5.  **GENERAL STYLE**:
    *   Avoid code blocks (e.g., \`\`\`text ... \`\`\`).
    *   Ensure proper line breaks and consistent spacing for easy readability. The output should be clean and professional.

Instructions:
1.  **Input Data**: The CSV data is: {{{csvData}}}.
2.  **Processing**: Validate the input, compute scores (if applicable, otherwise use provided averages), perform reliability analysis (if applicable), and breakdown by department, following ALL formatting rules for the output.
3.  **Output**: Return a single plain text summary string adhering to ALL the formatting guidelines above.

Example of Department Breakdown section format to follow:
DEPARTMENT BREAKDOWN:

HR DEPARTMENT
* Management Support Average: 3.9
* Autonomy Average: 3.9
* Rewards Average: 3.9
* Time Availability Average: 3.7
* Organizational Boundaries Average: 3.9

IT DEPARTMENT
* Management Support Average: 4.3
* Autonomy Average: 3.8
* Rewards Average: 4.2
* Time Availability Average: 3.7
* Organizational Boundaries Average: 4.1
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

