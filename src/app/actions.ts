'use server';

import { analyzeCEAISurveyData, type AnalyzeCEAISurveyDataInput } from '@/ai/flows/ceai-data-analyzer';

export async function handleFileUploadAndAnalyze(csvData: string): Promise<{ summary?: string; error?: string }> {
  if (!csvData) {
    return { error: 'CSV data is empty. Please upload a valid CSV file.' };
  }

  try {
    const input: AnalyzeCEAISurveyDataInput = { csvData };
    const result = await analyzeCEAISurveyData(input);
    if (!result || !result.summary) {
      return { error: 'Analysis returned no summary. Please check the data or try again.'}
    }
    return { summary: result.summary };
  } catch (e: any) {
    console.error('Error analyzing data:', e);
    // Try to provide a more user-friendly error message
    let errorMessage = 'Failed to analyze data due to an unexpected error.';
    if (e.message) {
        errorMessage = `Analysis failed: ${e.message}`;
    }
    // Specific check for common API errors (example, can be expanded)
    if (typeof e.message === 'string' && e.message.includes('API key not valid')) {
        errorMessage = "Analysis failed: Invalid API key configuration."
    }
    return { error: errorMessage };
  }
}
