export interface AnalysisResult {
  summary: string[];
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  advice: string;
  emailDraft: string;
}

export interface ExtractedText {
  text: string;
}
