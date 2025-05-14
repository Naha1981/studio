'use server';

import { analyzeCEAISurveyData, type AnalyzeCEAISurveyDataInput } from '@/ai/flows/ceai-data-analyzer';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000; // 2 seconds

export async function handleFileUploadAndAnalyze(csvData: string): Promise<{ summary?: string; error?: string }> {
  if (!csvData) {
    return { error: 'CSV data is empty. Please upload a valid CSV file.' };
  }

  let lastError: any = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const input: AnalyzeCEAISurveyDataInput = { csvData };
      const result = await analyzeCEAISurveyData(input);
      
      if (!result || !result.summary) {
        // This isn't a retryable API error, but an issue with the response content.
        // We don't retry this specific case; return the error.
        return { error: 'Analysis returned no summary. Please check the data or try again.' };
      }
      return { summary: result.summary }; // Success, exit loop and return
    } catch (e: any) {
      lastError = e;
      console.error(`Error analyzing data (attempt ${attempt}/${MAX_RETRIES}):`, e);

      // Check if the error is the specific 503 overload error
      if (e.message && typeof e.message === 'string' && (e.message.includes('503 Service Unavailable') || e.message.includes('model is overloaded'))) {
        if (attempt < MAX_RETRIES) {
          console.log(`Model overloaded. Retrying in ${RETRY_DELAY_MS / 1000} seconds... (Attempt ${attempt}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
          // Continue to the next attempt
        } else {
          // Max retries reached for 503 error
          const errorMessage = `Analysis failed after ${MAX_RETRIES} attempts: The model is currently overloaded. Please try again later.`;
          return { error: errorMessage };
        }
      } else {
        // For other types of errors, fail immediately without retrying.
        let errorMessage = 'Failed to analyze data due to an unexpected error.';
        if (e.message) {
            errorMessage = `Analysis failed: ${e.message}`;
        }
        if (typeof e.message === 'string' && e.message.includes('API key not valid')) {
            errorMessage = "Analysis failed: Invalid API key configuration."
        }
        return { error: errorMessage };
      }
    }
  }
  
  // Fallback error message, though ideally, all paths should return within the loop.
  // This would typically be reached only if MAX_RETRIES was 0 or if there's an issue with loop logic.
  let finalErrorMessage = 'Failed to analyze data after multiple attempts.';
  if (lastError && lastError.message) {
    finalErrorMessage = `Analysis failed: ${lastError.message}`;
  }
  return { error: finalErrorMessage };
}
