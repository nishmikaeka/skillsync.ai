import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post()
  async analyze(@Body() body: { cvText: string; jobText: string }) {
    const { cvText, jobText } = body;

    if (!cvText || !jobText) {
      throw new Error('CV text and job text are required');
    }

    const result = await this.geminiService.analyzeJobMatch(cvText, jobText);
    return result;
  }
}
