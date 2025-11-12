
import { GoogleGenAI } from "@google/genai";
import { LogEntry } from '../types';

export const analyzeLogs = async (logs: LogEntry[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const formattedLogs = JSON.stringify(logs.map(log => ({
    ...log,
    timestamp: new Date(log.timestamp).toLocaleString(),
  })), null, 2);

  const prompt = `
    You are a helpful assistant analyzing a user's medication and symptom log. 
    The user is tracking their reaction to a new medication.
    
    IMPORTANT: Do NOT provide any medical advice, diagnosis, or treatment recommendations. Your role is ONLY to identify patterns in the data provided.
    
    Based on the following data, provide a summary of potential correlations and patterns between medication intake and the reported symptoms.
    - Look for symptoms that appear or increase in severity shortly after a medication dose.
    - Note any recurring patterns in timing.
    - Keep the analysis objective and based strictly on the provided timestamps and data points.
    - Conclude by strongly recommending the user discuss these observations with their doctor or healthcare provider.
    
    Here is the data in JSON format:
    ${formattedLogs}
    
    Please provide the analysis in a clear, easy-to-read format using Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing logs with Gemini:", error);
    return "There was an error analyzing your logs. Please check the console for more details.";
  }
};
