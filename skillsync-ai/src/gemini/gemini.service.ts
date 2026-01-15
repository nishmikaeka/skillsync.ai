import { Injectable } from '@nestjs/common';
// Import the actual types from the SDK
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

export interface AnalysisResult {
  summary: string[];
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  advice: string;
  emailDraft: string;
}

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async analyzeJobMatch(
    cvText: string,
    jobText: string,
  ): Promise<AnalysisResult> {
    const prompt = `You are an expert Technical Recruiter. Analyze the following Job Description against the provided CV. 

CRITICAL INSTRUCTIONS:
1. Content Filtering: The Job Description text may contain irrelevant content like advertisements, sidebars, footer links, or unrelated site navigation. IGNORE these and focus ONLY on the actual job title, requirements, responsibilities, and company info.
2. Email Generation: Create a concise, professional, and personalized email/message draft (max 150 words) that the candidate can send to a recruiter for this specific role, highlighting their matching strengths.

CV Data: ${cvText}

Job Description: ${jobText}

Provide the output in STRICT JSON format:
{
  "summary": ["Point 1", "Point 2", "Point 3"],
  "matchPercentage": 0,
  "matchingSkills": ["Skill A", "Skill B"],
  "missingSkills": ["Skill C", "Skill D"],
  "advice": "One sentence on how to tailor the CV for this role.",
  "emailDraft": "The generated email draft text here..."
}

Focus on core technologies and relevant experience.`;

    try {
      const result = await this.model.generateContent(prompt);
      // Ensure the response exists and call .text() properly
      const responseText = result.response.text();

      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      return JSON.parse(cleanedText) as AnalysisResult;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Gemini API Error:', errorMessage);
      throw new Error('Failed to analyze job match');
    }
  }
}
